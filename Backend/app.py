from flask import Flask, request, jsonify, session
from flask_session import Session
from flask_cors import CORS
#from flask_mysqldb import MySQL
import bcrypt
import pymysql.cursors

app = Flask(__name__)
app.secret_key = '12345'
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)
CORS(app)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '12345'
app.config['MYSQL_DB'] = '5800_db'

mysql = pymysql.connect(
    host=app.config['MYSQL_HOST'],
    user=app.config['MYSQL_USER'],
    password=app.config['MYSQL_PASSWORD'],
    db=app.config['MYSQL_DB'],
    cursorclass=pymysql.cursors.DictCursor
)

@app.route('/test_connection')
def test_connection():
    return jsonify({'message': 'Backend is running and connected!'})

@app.route('/')
def home():
    return jsonify({'message': 'Backend is working, check the frontend connection'})

@app.route('/check_db_connection')
def check_db_connection():
    try:
        cursor = mysql.cursor()
        cursor.execute("SELECT 1")
        return jsonify({'message': 'Database connection successful!'})
    except Exception as e:
        return jsonify({'message': 'Database connection failed!', 'error': str(e)}), 500


@app.route('/signup', methods=['POST'])
def signup():
    user_details = request.json
    username = user_details.get('username')
    first_name = user_details.get('firstName')
    last_name = user_details.get('lastName')
    email = user_details['email']
    password = user_details['password'].encode('utf-8')
    role = user_details.get('role', 'donor')

    if len(password) < 8:
        return jsonify({'message': 'Password must be at least 8 characters long!'}), 400

    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

    try:
        cursor = mysql.cursor()
        cursor.callproc('InsertUser', (username, first_name, last_name, email, hashed_password, role))
        mysql.commit()

    except Exception as e:
        return jsonify({'message': 'Registration failed!', 'error': str(e)}), 500

    finally:
        cursor.close()

    return jsonify({'message': 'User registered successfully!'})


@app.route('/login', methods=['POST'])
def login():
    user_details = request.json
    email = user_details['email']
    password = user_details['password'].encode('utf-8')

    cursor = mysql.cursor()
    result = cursor.execute("SELECT * FROM users WHERE email = %s", [email])
    if result > 0:
        user = cursor.fetchone()
        if user and bcrypt.checkpw(password, user['password'].encode('utf-8')):  
            session['email'] = user['email']
            session['role'] = user['role']
            session['logged_in'] = True
            print(session)
            return jsonify({'message': 'Login successful!', 'role': user['role']})  
        else:
            return jsonify({'message': 'Invalid email or password!'}), 40
    cursor.close()


@app.route('/checklogin', methods=['GET'])
def check_login():
    print(session)
    if 'logged_in' in session and session['logged_in']:
        user_data = {
            'email': session['email'],
            'role': session['role']
        }
        return jsonify({'logged_in': True, 'user': user_data}), 200
    else:
        return jsonify({'logged_in': False}), 400
    

@app.route('/create-disaster-event', methods=['POST'])
def create_disaster_event():
    event_details = request.json
    event_title = event_details.get('event')
    event_type = event_details.get('eventType', 'Other')
    event_location = event_details.get('eventLocation')
    event_description = event_details.get('eventDescription')
    event_assistance_needed = event_details.get('eventAssistanceNeeded')
    event_items_needed = event_details.get('eventItemsNeeded')

    try:
        cursor = mysql.cursor()
        cursor.callproc('CreateDisasterEvent', (event_title, event_type, event_location, event_description, event_assistance_needed, event_items_needed))
        mysql.commit()
        cursor.close()
        return jsonify({'message': 'Event has been created!'}), 200
    except Exception as e:
        return jsonify({'message': 'Disaster Event Creation was unsuccessful!', 'error': str(e)}), 500


@app.route('/create-disaster-events', methods=['GET'])
def get_disaster_events():
    try:
        cursor = mysql.cursor()
        cursor.execute("SELECT * FROM Events")
        events = cursor.fetchall()

        formatted_events = []
        for event in events:
            formatted_event = {
                'eventID': event['id'],
                'eventTitle': event['Title'],
                'eventType': event['Type'],
                'eventLocation': event['Location'],
                'eventDescription': event['Description'],
                'eventAssistanceNeeded': event['AssistanceNeeded'],
                'eventItemsNeeded': event['ItemsNeeded']
            }
            formatted_events.append(formatted_event)

        return jsonify(formatted_events)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()


@app.route('/diaster-events-admin/<int:event_id>', methods=['OPTIONS'])
def handle_options():
    return '', 200


@app.route('/disaster-events-admin/<int:event_id>', methods=['DELETE'])
def delete_disaster_event(event_id):
    if request.method == 'DELETE':
        try:
            cursor = mysql.cursor()
            cursor.callproc('DeleteDisasterEvent', (event_id,))
            mysql.commit()
            response = jsonify({'message': 'Event deleted successfully'})
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
            return response, 200
        except pymysql.Error as e:
            print("Error deleting event:", e)
            return jsonify({'error': 'Internal Server Error'}), 500
        finally:
            cursor.close()
    else:
        return jsonify({'error': 'Method not allowed'}), 405
    

@app.route('/edit-event/<int:event_id>', methods=['PUT'])
def edit_disaster_event(event_id):
    if request.method == 'PUT':
        try:
            data = request.json
            event_title = data['eventTitle']
            event_type = data['eventType']
            event_location = data['eventLocation']
            event_description = data['eventDescription']
            assistance_needed = data['eventAssistanceNeeded']
            items_needed = data['eventItemsNeeded']
            
            cursor = mysql.cursor()
            cursor.callproc('EditDisasterEvent', (event_id, event_title, event_type, event_location, event_description, assistance_needed, items_needed))
            mysql.commit()
            response = jsonify({'message': 'Event edited successfully'})
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
         
            cursor.close()
            return response, 200
        except pymysql.Error as e:
            print("Error editing event:", e)
            return jsonify({'error': 'Internal Server Error'}), 500
    else:
        return jsonify({'error': 'Method not allowed'}), 405



@app.route('/donate-maintenance/<int:donation_id>', methods=['DELETE'])
def delete_donation_item(donation_id):
    if request.method == 'DELETE':
        try:
            cursor = mysql.cursor()
            cursor.callproc('DeleteDonationItem', (donation_id,))
            mysql.commit()
            response = jsonify({'message': 'Donation deleted successfully'})
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
            return response, 200
        except pymysql.Error as e:
            print("Error deleting event:", e)
            return jsonify({'error': 'Internal Server Error'}), 500
        finally:
            cursor.close()
    else:
        return jsonify({'error': 'Method not allowed'}), 405


@app.route('/edit-donation/<int:donation_id>', methods=['PUT'])
def edit_donation_item(donation_id):
    if request.method == 'PUT':
        try:
            data = request.json
            donation_title = data['donationTitle']
            donation_description = data['donationDescription']
            donation_quantity = data['donationQuantity']
            donation_location = data['donationLocation']
            donation_donor = data['donationDonor']
            donation_recipient = data['donationRecipient']
            
            cursor = mysql.cursor()
            cursor.callproc('EditDonationItem', (donation_id, donation_title, donation_description, donation_quantity, donation_location, donation_donor, donation_recipient))
            mysql.commit()
            response = jsonify({'message': 'Donation edited successfully'})
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
         
            cursor.close()
            return response, 200
        except pymysql.Error as e:
            print("Error editing event:", e)
            return jsonify({'error': 'Internal Server Error'}), 500
    else:
        return jsonify({'error': 'Method not allowed'}), 405


@app.route('/create-response-to-request', methods=['POST'])
def create_response_to_request():
    donation_details = request.json
    donation_title = donation_details.get('donation')
    donation_description = donation_details.get('donationDescription')
    donation_quantity = donation_details.get('donationQuantity')
    donation_location = donation_details.get('donationLocation')
    donation_donor = donation_details.get('donationDonor')
    donation_recipient = donation_details.get('donationRecipient')

    try:
        cursor = mysql.cursor()
        cursor.callproc('CreateResponsetoRequest', (donation_title, donation_description, donation_quantity, donation_location, donation_donor, donation_recipient))
        mysql.commit()
        cursor.close()
        return jsonify({'message': 'Donation response has been created!'}), 200
    except Exception as e:
        return jsonify({'message': 'Donation response was unsuccessful!', 'error': str(e)}), 500


@app.route('/create-response-to-request', methods=['GET'])
def get_donation_items():
    try:
        cursor = mysql.cursor()
        cursor.execute("SELECT * FROM Donations")
        donations = cursor.fetchall()

        formatted_donations = []
        for donation in donations:
            formatted_donation = {
                'donationID': donation['id'],
                'donationTitle': donation['Title'],
                'donationDescription': donation['Description'],
                'donationQuantity': donation['Quantity'],
                'donationLocation': donation['Location'],
                'donationDonor': donation['Donor'],
                'donationRecipient': donation['Recipient']
            }
            print(formatted_donation)
            formatted_donations.append(formatted_donation)

        return jsonify(formatted_donations)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()


@app.route('/create-requests', methods=['OPTIONS'])
def handle_options1():
    return '', 200

@app.route('/create-request', methods=['POST'])
def create_request():
    request_details = request.json
    request_title = request_details.get('title')
    request_description = request_details.get('description')
    request_category = request_details.get('category')
    request_quantity = request_details.get('quantityNeeded')
    request_urgency = request_details.get('urgency')
    request_location = request_details.get('location')
    request_contact = request_details.get('contactName')
    request_email = request_details.get('email')
    request_phone = request_details.get('phone')
    request_preferred = request_details.get('preferredContactMethod')
    request_deadline = request_details.get('deadline')
    request_instructionsForDonors = request_details.get('instructionsForDonors')
    request_additionalComments = request_details.get('additionalComments')

    try:
        cursor = mysql.cursor()
        cursor.callproc('CreateRequest', (request_title, request_description, request_category, request_quantity, request_urgency, 
                                          request_location, request_contact, request_email, request_phone, request_preferred,
                                          request_deadline, request_instructionsForDonors, request_additionalComments))
        mysql.commit()
        cursor.close()
        return jsonify({'message': 'Request has been created!'}), 200
    except Exception as e:
        return jsonify({'message': 'Request was unsuccessful!', 'error': str(e)}), 500


@app.route('/create-request', methods=['GET'])
def get_request_items():
    try:
        cursor = mysql.cursor()
        cursor.execute("SELECT * FROM Requests")
        requests = cursor.fetchall()

        formatted_requests = []
        for request in requests:
            formatted_request = {
                'id': request['id'],
                'title': request['Title'],
                'description': request['Description'],
                'category': request['Category'],
                'quantity': request['Quantity'],
                'urgency': request['Urgency'],
                'location': request['Location'],
                'contact': request['Contact'],
                'email': request['Email'],
                'phone': request['Phone'],
                'preferred': request['Preferred'],
                'deadline': request['Deadline'],
                'instructions': request['Instructions'],
                'additional': request['Additional']
            }
            formatted_requests.append(formatted_request)

        return jsonify([formatted_requests])
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()


@app.route('/manual-match', methods=['OPTIONS'])
def handle_options2():
    return '', 200

@app.route('/manual-match', methods=['POST'])
def manual_match():
    data = request.json
    request_data = data.get('request')
    response_data = data.get('response')


    cursor = mysql.cursor()
    cursor.callproc('InsertMatch', (request_data, response_data))
    mysql.commit()
  
    cursor.close()

    return jsonify({'message': 'Match registered successfully!'})


if __name__ == '__main__':
    app.run(debug=True)
