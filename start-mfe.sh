#!/bin/bash

echo "Starting Module Federation Setup..."
echo "================================="

# Start React MFE
echo "Starting React MFE on port 4202..."
cd react-mfe && npm start &
REACT_PID=$!

# Give React time to start
sleep 5

# Start Angular Shell
echo "Starting Angular Shell on port 4200..."
cd .. && npm start &
ANGULAR_PID=$!

echo ""
echo "================================="
echo "Applications started!"
echo "Angular Shell: http://localhost:4200"
echo "React MFE: http://localhost:4202"
echo ""
echo "Press Ctrl+C to stop all applications"
echo "================================="

# Wait for user interrupt
wait $REACT_PID $ANGULAR_PID