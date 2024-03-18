import socketio
import random
import time
from datetime import datetime
import os
env_var_value = os.getenv("ADDRESS")
address = 'http://192.168.0.102:5000'
if env_var_value is not None:
    time.sleep(15)
    address = env_var_value
# Create a SocketIO client instance
sio = socketio.SimpleClient()

# Connect to the SocketIO server
sio.connect(address)

# Function to generate simulated data
def generate_data():
    # Simulate blood pressure data
    systolic_bp = random.randint(90, 140)
    diastolic_bp = random.randint(60, 90)
    
    # Simulate heart rate data
    heart_rate = random.randint(60, 100)
    
    # Add some variation to mimic human behavior
    if random.random() < 0.1:
        systolic_bp += random.randint(-10, 10)
        diastolic_bp += random.randint(-5, 5)
        heart_rate += random.randint(-5, 5)

    return {"bp": systolic_bp, "bpm": heart_rate, "timestamp": datetime.now().isoformat()}
    # return {"bp": {"systolic": systolic_bp, "diastolic": diastolic_bp}, "bpm": heart_rate}

# Function to send data to the server
def send_data():
    while True:
        data = generate_data()
        sio.emit('patient', {"patientId":"65ed3ac785bdb17bc725906e","log":data})
        print(data)
        time.sleep(5)

# Start sending data
send_data()