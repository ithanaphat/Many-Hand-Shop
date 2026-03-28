const express = require("express")

const router = express.Router()
const { Order, Product, User } = require("../models/user.js")

const roundToTwo = (value) => Math.round(Number(value || 0) * 100) / 100

const formatOrder = (order) => ({
    _id: order._id,
    buyer: order.buyer,
    shippingInfo: order.shippingInfo,
    shippingFee: order.shippingFee,
    totalPrice: order.totalPrice,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
        price: item.price,
        review: item.review?.rating
            ? {
                rating: item.review.rating,
                ratedAt: item.review.ratedAt,
            }
            : null,
        product: item.product
            ? {
                _id: item.product._id,
                name: item.product.name,
                images: item.product.images || [],
            }
            : null,
        seller: item.seller
            ? {
                _id: item.seller._id,
                username: item.seller.username,
                images: item.seller.images || [],
                rating: item.seller.rating || 0,
                ratingCount: item.seller.ratingCount || 0,
            }
            : null,
    })),
})

router.get("/buyer/:buyerId", async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.params.buyerId })
            .sort({ createdAt: -1 })
            .populate("items.product", "name images")
            .populate("items.seller", "username images rating ratingCount")

        res.json(orders.map(formatOrder))
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error fetching orders" })
    }
})

router.get("/seller/:sellerId/ratings", async (req, res) => {
    try {
        const orders = await Order.find({
            "items.seller": req.params.sellerId,
            "items.review.rating": { $exists: true },
        })
            .sort({ createdAt: -1 })
            .populate("buyer", "username images")
            .populate("items.product", "name images")

        const ratingDetails = []

        for (const order of orders) {
            for (const item of order.items) {
                if (
                    String(item.seller) === String(req.params.sellerId) &&
                    item.review?.rating
                ) {
                    ratingDetails.push({
                        orderId: order._id,
                        orderItemId: item._id,
                        rating: item.review.rating,
                        ratedAt: item.review.ratedAt,
                        reviewer: order.buyer
                            ? {
                                _id: order.buyer._id,
                                username: order.buyer.username,
                                images: order.buyer.images || [],
                            }
                            : null,
                        product: item.product
                            ? {
                                _id: item.product._id,
                                name: item.product.name,
                                images: item.product.images || [],
                            }
                            : null,
                    })
                }
            }
        }

        ratingDetails.sort((a, b) => {
            const aTime = a.ratedAt ? new Date(a.ratedAt).getTime() : 0
            const bTime = b.ratedAt ? new Date(b.ratedAt).getTime() : 0
            return bTime - aTime
        })

        res.json({
            sellerId: req.params.sellerId,
            total: ratingDetails.length,
            ratings: ratingDetails,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Error fetching seller ratings" })
    }
})

router.post("/", async (req, res) => {
    const { buyer, items, shippingInfo, shippingFee, totalPrice, paymentMethod } = req.body

    if (!buyer || !Array.isArray(items) || items.length === 0 || !shippingInfo || !paymentMethod) {
        return res.status(400).json({ message: "Incomplete order payload" })
    }

    try {
        const buyerExists = await User.findById(buyer).select("_id")
        if (!buyerExists) {
            return res.status(404).json({ message: "Buyer not found" })
        }

        const normalizedItems = []

        for (const item of items) {
            const productId = item.product || item.productId || item.id
            const quantity = Number(item.quantity)
            const product = await Product.findById(productId).populate("seller", "_id username")

            if (!product) {
                return res.status(404).json({ message: "Product not found" })
            }

            if (String(product.seller._id) === String(buyer)) {
                return res.status(400).json({
                    message: `You cannot buy your own product: ${product.name}`
                })
            }   

            if (!Number.isInteger(quantity) || quantity < 1) {
                return res.status(400).json({ message: "Invalid quantity" })
            }

            if (product.stock < quantity) {
                return res.status(400).json({ message: `${product.name} does not have enough stock` })
            }

            normalizedItems.push({
                product: product._id,
                seller: product.seller._id,
                quantity,
                price: roundToTwo(item.price ?? product.price),
            })
        }

        const calculatedSubtotal = normalizedItems.reduce(
            (sum, item) => sum + roundToTwo(item.price) * item.quantity,
            0
        )
        const normalizedShippingFee = roundToTwo(shippingFee)
        const calculatedTotal = roundToTwo(calculatedSubtotal + normalizedShippingFee)
        const requestedTotal = roundToTwo(totalPrice)

        if (requestedTotal && requestedTotal !== calculatedTotal) {
            return res.status(400).json({ message: "Total price mismatch" })
        }

        const order = await Order.create({
            buyer,
            items: normalizedItems,
            shippingInfo: {
                name: String(shippingInfo.name || "").trim(),
                phone: String(shippingInfo.phone || "").trim(),
                address: String(shippingInfo.address || "").trim(),
            },
            shippingFee: normalizedShippingFee,
            totalPrice: calculatedTotal,
            paymentMethod,
        })

        for (const item of normalizedItems) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
        }

        const populatedOrder = await Order.findById(order._id)
            .populate("items.product", "name images")
            .populate("items.seller", "username images rating ratingCount")

        res.status(201).json({
            message: "Order created",
            order: formatOrder(populatedOrder),
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message || "Error creating order" })
    }
})

router.post("/:orderId/items/:itemId/rate", async (req, res) => {
    const { buyerId, rating } = req.body
    const numericRating = Number(rating)

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({ message: "rating 1-5 is required" })
    }

    try {
        const order = await Order.findById(req.params.orderId)
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        if (String(order.buyer) !== String(buyerId)) {
            return res.status(403).json({ message: "This order does not belong to the current user" })
        }

        const orderItem = order.items.id(req.params.itemId)
        if (!orderItem) {
            return res.status(404).json({ message: "Order item not found" })
        }

        if (orderItem.review?.rating) {
            return res.status(409).json({ message: "This item has already been rated" })
        }

        const seller = await User.findById(orderItem.seller)
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" })
        }

        const currentTotal = Number(seller.rating || 0) * Number(seller.ratingCount || 0)
        const nextCount = Number(seller.ratingCount || 0) + 1
        seller.rating = roundToTwo(currentTotal + numericRating) / nextCount
        seller.ratingCount = nextCount
        await seller.save()

        orderItem.review = {
            rating: numericRating,
            ratedAt: new Date(),
        }
        await order.save()

        res.json({
            message: "Seller rated successfully",
            seller: {
                _id: seller._id,
                rating: seller.rating,
                ratingCount: seller.ratingCount,
            },
            item: {
                _id: orderItem._id,
                review: orderItem.review,
            },
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message || "Error rating seller" })
    }
})

module.exports = router