from flask import Flask, request, render_template
import requests

BACKEND_URL = 'http://0.0.0.0:5000'
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    form_data = dict(request.form)
    requests.post(BACKEND_URL + '/submit', json=form_data)
    return 'data submitted successfully!'
    

@app.route('/get_data')
def get_data():
    response = requests.get(BACKEND_URL + '/view')
    return response.json()

if __name__=='__main__':

    app.run(host='0.0.0.0',port=8000,debug=True)