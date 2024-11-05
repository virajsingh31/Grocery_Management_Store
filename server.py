import json
from flask import Flask, request, jsonify
from flask import render_template
import order_dao
from sql_connection import get_sql_connection
import products_dao
import uom_dao

app = Flask(__name__)

connection = get_sql_connection()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/getProducts', methods=['GET'])
def get_products():
    products = products_dao.get_all_products(connection)
    response = jsonify(products)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/getUOM', methods=['GET'])
def get_uom():
    response = uom_dao.get_uoms(connection)
    response = jsonify(response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/deleteProduct', methods=['POST'])
def delete_product():
    return_id = products_dao.delete_product(connection, request.form['product_id'])
    response = jsonify({
        'product_id':return_id
    })
    response.headers.add('Access-Control-Allow-Origin','*')
    return response

@app.route('/getAllOrders', methods=['Get'])
def get_all_orders():
    response = order_dao.get_all_orders(connection)
    response = jsonify(response)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/insertOrder', methods=['POST'])
def insert_order():
    request_payload = json.loads(request.form['data'])
    order_id = order_dao.insert_order(connection, request_payload)
    response = jsonify({
        'order_id': order_id
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/insertProduct', methods=['POST'])
def insert_product():
    request_payload = json.loads(request.form['data'])
    product_id = products_dao.insert_new_products(connection, request_payload)
    response = jsonify({
        'product_id': product_id
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# Route for "Manage Products"
@app.route('/manage-product', methods=['Get'])
def manage_product():
    return render_template('manage-product.html')

# Route for "New Order"
@app.route('/order')
def new_order():
    return render_template('order.html')

@app.route('/add-product', methods=['POST'])
def add_product():
    data = request.get_json()  # Get the JSON data from the request

    # Prepare your product data
    product_data = {
        'name': data['name'],
        'uom': data['uom'],
        'price_per_unit': data['price']
    }

    # Call your DAO function to insert the product
    product_id = products_dao.insert_new_products(connection, product_data)

    # Return a response
    return jsonify({'message': 'Product added successfully!', 'product_id': product_id}), 201

if __name__ == "__main__":
    print("Starting Python Flask Server For Grocery Management App")
    app.run(debug=True, port=5000)

