

class SpokenCommandManager():

    def __init__(self):
        self.indices = {
            'davinci': 0,
            'galileo': 1,
            'machiavelli': 2,
            'noam chomsky': 3,
            'inigo montoya': 4,
            'salvador dali': 5,
            'harry potter': 6,
            'nicholas flamel': 7
        }
        self.remove_command = 'vaseline'

    def parse_command(self, text):
        for command in self.indices:
            if command in text.lower():
                return (self.indices[command], self.remove_command in text.lower())

        return (None, None)
            
