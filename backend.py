from flask import Flask, request, redirect, jsonify
from flask_cors import CORS, cross_origin
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

methods_mapping = {
    'GET': requests.get,
    'POST': requests.post,
    'DELETE': requests.delete,
    'PUT': requests.put
}

@cross_origin()
@app.route('/')
@app.route('/perform', methods=['GET', 'POST'])
def perform():
    if request.method == 'GET':
        return "Ummm... this is awkward... unable to process this bizarre request... please leave me alone !!!"

    user_response = {}
    error = ''
    status_code = 200

    url = request.get_json()['URL']
    headers = request.get_json()['HEADERS']
    body = request.get_json()['BODY']
    request_method = methods_mapping.get(request.get_json()['METHOD'])

    try:
        if request_method != requests.get:
            proxy_response = request_method(url=url, headers=headers, json=body)
        else:
            proxy_response = request_method(url=url, headers=headers)
        
        try:
            user_response['JSON_RESPONSE'] = proxy_response.json()
        except:
            user_response['JSON_RESPONSE'] = {}

        status_code = proxy_response.status_code
        user_response['TEXT_RESPONSE'] = proxy_response.text
    except requests.RequestException:
        error = 'Please check the URL or internet connection'
    except requests.ConnectionError:
        error = 'Please check your internet connection'
    except requests.HTTPError:
        error = 'Please check the URL'
    except:
        error = 'Something is not right...'
    finally:
        if error:
            status_code = 500
            print(error)
            return jsonify({'ERROR': error}), status_code
        else:
            return jsonify(user_response), status_code

@app.route('/test', methods=['GET', 'POST', 'DELETE', 'PUT'])
def testRequest():
    if request.method == 'GET':
        return jsonify({'response':'successful GET request'})
    elif request.method == 'POST':
        return jsonify({'response':'successful POST request', 'payload': request.get_json()})
    elif request.method == 'DELETE':
        return jsonify({'response': 'successful DELETE request', 'paylod': request.get_json()})
    elif request.method == 'PUT':
        return jsonify({'response': 'successful PUT request', 'payload': request.get_json()})

if __name__ =='__main__':
    app.run(threaded=True)
