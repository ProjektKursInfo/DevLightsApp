# Check if adb and yarn are installed on your computer
# Run this as User, not as root if you have not configured a root environment variable for adb 

#########################
#Killing an perhaps existing adb server and starting a new
adb kill-server
adb start-server
# Checking if an USB Android device is connected and if it is connected starting connection
timeout 5 adb wait-for-usb-device && adb reverse tcp:8081 tcp:8081 || echo "Connecting with android device failed"

#Checking if NodeJS Server is Running and if not starting it.
yarn start && echo "Starting Metro Development Server..."

#Install Debug App if not installed
adb shell pm list packages | grep com.devlights.debug && echo "App is already installed" || react-native run-android &

#Starting the App
adb shell am start -n com.devlights.debug/com.devlights.MainActivity
###################

