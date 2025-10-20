import sys
import time
import requests

def test_backend():
    """Test if the backend server is running"""
    try:
        print("Testing backend connection...")
        response = requests.get('http://localhost:5000/api/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend is CONNECTED!")
            print(f"   Status: {data.get('status')}")
            print(f"   Version: {data.get('version')}")
            print(f"   Frontend Built: {data.get('frontend_built')}")
            print(f"   Timestamp: {data.get('timestamp')}")
            return True
        else:
            print(f"❌ Backend returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is NOT RUNNING!")
        print("   The Flask server at http://localhost:5000 is not accessible.")
        print("\n📌 To start the backend, run:")
        print("   python app.py")
        return False
    except Exception as e:
        print(f"❌ Error testing backend: {str(e)}")
        return False

def test_frontend():
    """Test if the frontend dev server is running"""
    try:
        print("\nTesting frontend connection...")
        response = requests.get('http://localhost:5173', timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is CONNECTED!")
            print("   Running at: http://localhost:5173")
            return True
        else:
            print(f"❌ Frontend returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Frontend is NOT RUNNING!")
        print("   The Vite dev server at http://localhost:5173 is not accessible.")
        print("\n📌 To start the frontend, run:")
        print("   cd Loan_Approval/project")
        print("   npm install")
        print("   npm run dev")
        return False
    except Exception as e:
        print(f"❌ Error testing frontend: {str(e)}")
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("🔍 LOAN APPROVAL APPLICATION - CONNECTION TEST")
    print("=" * 60)
    
    backend_ok = test_backend()
    frontend_ok = test_frontend()
    
    print("\n" + "=" * 60)
    print("📊 CONNECTION SUMMARY")
    print("=" * 60)
    print(f"Backend (Port 5000):  {'✅ CONNECTED' if backend_ok else '❌ NOT CONNECTED'}")
    print(f"Frontend (Port 5173): {'✅ CONNECTED' if frontend_ok else '❌ NOT CONNECTED'}")
    print("=" * 60)
    
    if not backend_ok and not frontend_ok:
        print("\n⚠️  Both servers need to be started!")
        print("\n📝 Quick Start Guide:")
        print("   Terminal 1 (Backend):")
        print("   > python app.py")
        print("\n   Terminal 2 (Frontend):")
        print("   > cd Loan_Approval/project")
        print("   > npm run dev")
    elif not backend_ok:
        print("\n⚠️  Backend server needs to be started!")
        print("   Run: python app.py")
    elif not frontend_ok:
        print("\n⚠️  Frontend server needs to be started!")
        print("   Run: cd Loan_Approval/project && npm run dev")
    else:
        print("\n✅ All systems are operational!")
        print("   Open your browser: http://localhost:5173")
    
    sys.exit(0 if (backend_ok and frontend_ok) else 1)

