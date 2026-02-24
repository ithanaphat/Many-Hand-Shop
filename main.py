from flask import Flask , jsonify,request

app = Flask(__name__)

# Sample data (in-memory database for simplicity)
books = [
    {"id": 1, "title": "Man u 2 - 1 Liverpool", "author": "Bryan Mbuemo"},
    {"id": 2, "title": "Man City 2 - 1 Liverpool ", "author": "Erling Haaland"},
    {"id": 3, "title": "Cold", "author": "Michel Carrick"}
]

@app.route("/")
def hello_world():
    return "<p>ผมเอง ไอโอ๊ดไงง</p>" 

# Create (POST) operation
@app.route('/books', methods=['POST'])
def create_book():
    data = request.get_json()

    new_book = {
        "id": len(books) + 1,
        "title": data["title"],
        "author": data["author"]
    }

    books.append(new_book)
    return jsonify(new_book), 201
    
    # Read (GET) operation - Get all books
@app.route('/books', methods=['GET'])
def get_all_books():
    return jsonify({"books": books})

# Read (GET) operation - Get a specific book by ID
@app.route('/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = next((b for b in books if b["id"] == book_id), None)
    if book:
        return jsonify(book)
    else:
        return jsonify({"error": "Book not found"}), 404
    
    # Update (PUT) operation
@app.route('/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    book = next((b for b in books if b["id"] == book_id), None)
    if book:
        data = request.get_json()
        book.update(data)
        return jsonify(book)
    else:
        return jsonify({"error": "Book not found"}), 404
    
    # Delete operation
@app.route('/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    global books
    books = [b for b in books if b["id"] != book_id]
    return jsonify({"message": "Book deleted successfully"})
    

if __name__ == '__main__':
        app.run(host = "0.0.0.0" , port = 5000 , debug = True)