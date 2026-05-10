#!/usr/bin/env python3
"""
Karaoke Spin Wheel - Local Web App Launcher
Run this script to start the app in your browser.

Usage:
    python3 run.py
"""

import http.server
import socketserver
import os
import threading
import signal
import sys
import subprocess

PORT = 8765
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class ReuseAddrServer(socketserver.TCPServer):
    allow_reuse_address = True


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Suppress default logging for cleaner output
        pass


def open_browser():
    """Open the browser after a short delay to let the server start."""
    import time
    time.sleep(0.8)
    url = f"http://localhost:{PORT}"
    print(f"Opening {url} in your browser...")

    opened = False

    # Method 1: flatpak-spawn (when running inside a flatpak container, e.g. VSCode)
    if not opened:
        try:
            subprocess.Popen(
                ["flatpak-spawn", "--host", "flatpak", "run", "org.mozilla.firefox", url],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
            )
            opened = True
            print("Launched Firefox via flatpak-spawn")
        except (FileNotFoundError, OSError):
            pass

    # Method 2: flatpak Firefox directly (if not inside a container)
    if not opened:
        try:
            subprocess.Popen(
                ["flatpak", "run", "org.mozilla.firefox", url],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
            )
            opened = True
            print("Launched Firefox (flatpak)")
        except (FileNotFoundError, OSError):
            pass

    # Method 3: xdg-open
    if not opened:
        try:
            subprocess.Popen(
                ["xdg-open", url],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
            )
            opened = True
            print("Launched via xdg-open")
        except (FileNotFoundError, OSError):
            pass

    # Method 4: Python webbrowser module
    if not opened:
        try:
            import webbrowser
            webbrowser.open(url)
            opened = True
            print("Launched via Python webbrowser module")
        except Exception:
            pass

    if not opened:
        print(f"\nCould not auto-open browser. Please open manually:")
        print(f"  {url}\n")


def signal_handler(sig, frame):
    print("\nShutting down server...")
    sys.exit(0)


if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)

    print(f"Karaoke Spin Wheel")
    print(f"{'=' * 40}")
    print(f"Starting server on http://localhost:{PORT}")
    print(f"Press Ctrl+C to stop the server\n")

    # Open browser in a background thread
    threading.Thread(target=open_browser, daemon=True).start()

    with ReuseAddrServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
