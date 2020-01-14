from flask_socketio import SocketIO, emit
from time import sleep
import voice_commands

class PhraseSocket:
    def __init__(self, app, cache):
        self.socketio = SocketIO(app)
        self.server_thread = None
        self.socketio.on_event('connect', self.on_connect)
        self.command_manager = voice_commands.SpokenCommandManager()
        self.cache = cache

 
    def handlePhrasing(self, userId, speech):
        print('updating buffers with', speech)
        
        cmd_index, remove = self.command_manager.parse_command(speech)
        if cmd_index is not None and remove is not None:
            if remove is True and cmd_index < len(self.cache.stage):
                self.cache.stage.pop(cmd_index)
            elif remove is False and cmd_index < len(self.cache.phrases):
                self.cache.stage.insert(0, self.cache.phrases.pop(cmd_index))
                if len(self.cache.stage) > self.cache.stage_len:
                    self.cache.stage = self.cache.stage[:self.cache.stage_len]
        else:
            print(self.cache.phrases)
            self.cache.phrases.insert(0, speech)
            if len(self.cache.phrases) > self.cache.phrases_len:
                self.cache.phrases = self.cache.phrases[:self.cache.stage_len]
        print(self.cache.phrases, len(self.cache.phrases))
        self.cache.dataReady = True

    def server_poll(self):
        while True:
            sleep(0.1)
            if self.cache.dataReady:
                self.handlePhrasing("asdfIdfiller", self.cache.speech)
                print("emitting... &**********************************)")
                self.socketio.emit('my_response', {'phrases': self.cache.phrases, 'stage': self.cache.stage})
                self.cache.dataReady = False

    def on_connect(self):
        emit('my_response', {'phrases': ['nothing so far tbh'], 'stage': ['']})
        if self.server_thread is None:
            pass
            self.server_thread = self.socketio.start_background_task(self.server_poll)

    

