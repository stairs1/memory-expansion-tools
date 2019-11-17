import subprocess

class Register():
    
    def __init__(self):
        self.on = False
        self.registry = []

    def start(self):
        self.on = True
        self.record_loop()

    def record_loop(self):
        while self.on:
            speech = subprocess.run(['termux-speech-to-text'], capture_output=True)
            if speech.stdout != b'':
                self.registry.append(speech.stdout)
            print()
            print("current registry: ")
            for i, reg in enumerate(self.registry):
                print(i, ".", reg)

reg = Register()
reg.start()
