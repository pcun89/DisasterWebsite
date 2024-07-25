from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
import bcrypt
import os

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'root')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', 'Mssc@1407')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'login')

mysql = MySQL(app)

@app.route('/make-pledge', methods=['POST'])
def make_pledge():
    details = request.json
    required_fields = ['pledgeType', 'amount', 'supplies', 'services', 'disasterType', 'region', 'name', 'email', 'phone', 'address', 'preferredContactMethod', 'anonymity', 'recurring', 'comments']
    missing_fields = [field for field in required_fields if field not in details]
    if missing_fields:
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO pledges (pledgeType, amount, supplies, services, disasterType, region, name, email, phone, address, preferredContactMethod, anonymity, recurring, comments)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, 
            (details['pledgeType'], details['amount'], details['supplies'], details['services'], details['disasterType'], details['region'], details['name'], details['email'], details['phone'], details['address'], details['preferredContactMethod'], details['anonymity'], details['recurring'], details['comments'])
        )
        mysql.connection.commit()
        return jsonify({'message': 'Pledge made successfully'}), 201
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()

@app.route('/requests', methods=['POST'])
def create_request_for_donation():
    details = request.json
    required_fields = ['title', 'description', 'category', 'quantityNeeded', 'urgency', 'location', 'contactName', 'email', 'phone', 'preferredContactMethod', 'deadline', 'instructionsForDonors', 'additionalComments']
    missing_fields = [field for field in required_fields if field not in details]
    if missing_fields:
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO donation_requests (title, description, category, quantityNeeded, urgency, location, contactName, email, phone, preferredContactMethod, deadline, instructionsForDonors, additionalComments)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, 
            (details['title'], details['description'], details['category'], details['quantityNeeded'], details['urgency'], details['location'], details['contactName'], details['email'], details['phone'], details['preferredContactMethod'], details['deadline'], details['instructionsForDonors'], details['additionalComments'])
        )
        mysql.connection.commit()
        return jsonify({'message': 'Request for donation created successfully'}), 201
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()

if __name__ == '__main__':
    app.run(debug=True)


