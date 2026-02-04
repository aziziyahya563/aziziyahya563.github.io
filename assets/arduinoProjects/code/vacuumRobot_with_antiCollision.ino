// ----------------------------- LIBRARIES ------------------------------
#include <AFMotor.h>
#include <NewPing.h>
#include <Servo.h>

// ----------------------------- CONSTANTS ------------------------------
#define TRIG_PIN A5
#define ECHO_PIN A4
#define MAX_DISTANCE 200 
#define MAX_SPEED 190 
#define MAX_SPEED_OFFSET 20 

// Pause button
#define PAUSE_BUTTON 13
bool isPaused = false;

// ----------------------------- CONFIGURATION ------------------------------
// Servo Settings
#define SERVO_CENTER 115
#define SERVO_WIGGLE_RANGE 30 
#define SERVO_SPEED 4      

NewPing sonar(TRIG_PIN, ECHO_PIN, MAX_DISTANCE);

// Create motors
AF_DCMotor motor1(1, MOTOR12_1KHZ); 
AF_DCMotor motor2(2, MOTOR12_1KHZ);
AF_DCMotor motor3(3, MOTOR34_1KHZ);
AF_DCMotor motor4(4, MOTOR34_1KHZ);

Servo myservo;

// ----------------------------- MOTOR REVERSAL FLAGS ------------------------------
bool reverseM1 = true;   
bool reverseM2 = false;   
bool reverseM3 = false;   
bool reverseM4 = true;   

// ----------------------------- TIMING VARIABLES ------------------------------
unsigned long previousMillisServo = 0;
unsigned long previousMillisPing = 0;
const long servoInterval = 30;
const long pingInterval = 50;

// ----------------------------- STATE VARIABLES ------------------------------
int servoPos = SERVO_CENTER;
int servoDir = 1;
int currentDistance = 100;

// ----------------------------- PAUSE CHECK ------------------------------
void updatePauseState() {
  isPaused = (digitalRead(PAUSE_BUTTON) == LOW);
  if (isPaused) moveStop();
}

// ----------------------------- SETUP ------------------------------
void setup() 
{
  pinMode(PAUSE_BUTTON, INPUT_PULLUP);

  myservo.attach(10);
  myservo.write(SERVO_CENTER);
  delay(2000);
  
  currentDistance = readPingInstant();
}

// ----------------------------- MAIN LOOP ------------------------------
void loop() 
{
  updatePauseState();
  if (isPaused) return;

  unsigned long currentMillis = millis();

  // --- TASK 1: Radar Sweep ---
  if (currentMillis - previousMillisServo >= servoInterval) {
    previousMillisServo = currentMillis;
    updateServoSweep();
  }

  // --- TASK 2: Read Sensor ---
  if (currentMillis - previousMillisPing >= pingInterval) {
    previousMillisPing = currentMillis;
    currentDistance = readPingInstant();
    
    if (currentDistance <= 20 && currentDistance > 0) {
      avoidObstacle();
      previousMillisServo = millis();
      previousMillisPing = millis();
    } else {
      moveForward();
    }
  }
}

// ----------------------------- HELPER FUNCTIONS ------------------------------
void updateServoSweep() {
  servoPos += (servoDir * SERVO_SPEED);

  if (servoPos >= (SERVO_CENTER + SERVO_WIGGLE_RANGE)) {
    servoPos = SERVO_CENTER + SERVO_WIGGLE_RANGE;
    servoDir = -1;
  }
  else if (servoPos <= (SERVO_CENTER - SERVO_WIGGLE_RANGE)) {
    servoPos = SERVO_CENTER - SERVO_WIGGLE_RANGE;
    servoDir = 1;
  }
  myservo.write(servoPos);
}

void avoidObstacle() {
  moveStop();
  delay(200);

  moveBackward();
  delay(300);
  moveStop();
  delay(200);

  myservo.write(SERVO_CENTER); 
  delay(300); 

  int distanceR = lookRight();
  int distanceL = lookLeft();

  if (distanceR < 20 && distanceL < 20) {
    turnAround();
  }
  else if (distanceR >= distanceL) {
    turnRight();
  } 
  else {
    turnLeft();
  }
  
  myservo.write(SERVO_CENTER);
  servoPos = SERVO_CENTER; 
  delay(200);
}

int lookRight() {
  myservo.write(50);
  delay(400);
  int d = readPingInstant();
  myservo.write(SERVO_CENTER);
  return d;
}

int lookLeft() {
  myservo.write(170);
  delay(400);
  int d = readPingInstant();
  myservo.write(SERVO_CENTER);
  return d;
}

int readPingInstant() {
  int cm = sonar.ping_cm();
  if (cm == 0) cm = 250;
  return cm;
}

// ----------------------------- MOTOR DRIVER ------------------------------
void driveMotor(AF_DCMotor &m, bool rev, int spd, uint8_t dir) {
  m.setSpeed(spd);
  if (rev) {
    if (dir == FORWARD)  m.run(BACKWARD);
    else if (dir == BACKWARD) m.run(FORWARD);
    else if (dir == RELEASE)  m.run(RELEASE);
  } else {
    m.run(dir);
  }
}

void moveStop() {
  driveMotor(motor1, reverseM1, 0, RELEASE);
  driveMotor(motor2, reverseM2, 0, RELEASE);
  driveMotor(motor3, reverseM3, 0, RELEASE);
  driveMotor(motor4, reverseM4, 0, RELEASE);
}

void moveForward() {
  driveMotor(motor1, reverseM1, MAX_SPEED, FORWARD);
  driveMotor(motor2, reverseM2, MAX_SPEED, FORWARD);
  driveMotor(motor3, reverseM3, MAX_SPEED, FORWARD);
  driveMotor(motor4, reverseM4, MAX_SPEED, FORWARD);
}

void moveBackward() {
  driveMotor(motor1, reverseM1, MAX_SPEED, BACKWARD);
  driveMotor(motor2, reverseM2, MAX_SPEED, BACKWARD);
  driveMotor(motor3, reverseM3, MAX_SPEED, BACKWARD);
  driveMotor(motor4, reverseM4, MAX_SPEED, BACKWARD);
}

void turnRight() {
  driveMotor(motor1, reverseM1, MAX_SPEED, FORWARD);
  driveMotor(motor2, reverseM2, MAX_SPEED, FORWARD);
  driveMotor(motor3, reverseM3, MAX_SPEED, BACKWARD);
  driveMotor(motor4, reverseM4, MAX_SPEED, BACKWARD);
  delay(random(400, 700));
  moveStop();
}

void turnLeft() {
  driveMotor(motor1, reverseM1, MAX_SPEED, BACKWARD);
  driveMotor(motor2, reverseM2, MAX_SPEED, BACKWARD);
  driveMotor(motor3, reverseM3, MAX_SPEED, FORWARD);
  driveMotor(motor4, reverseM4, MAX_SPEED, FORWARD);
  delay(random(400, 700));
  moveStop();
}

void turnAround() {
  driveMotor(motor1, reverseM1, MAX_SPEED, FORWARD);
  driveMotor(motor2, reverseM2, MAX_SPEED, FORWARD);
  driveMotor(motor3, reverseM3, MAX_SPEED, BACKWARD);
  driveMotor(motor4, reverseM4, MAX_SPEED, BACKWARD);
  delay(1000);
  moveStop();
}
