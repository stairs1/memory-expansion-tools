

class SpokenCommandManager():

    def __init__(self):
        self.stageIndices = {
            'davinci': 0,
            'level one cache' : 0,
            'level 1 cache' : 0,
            'level one cash' : 0,
            'level 1 cash' : 0,
            'galileo': 1,
            'machiavelli': 2,
            'noam chomsky': 3,
            'inigo montoya': 4,
            'salvador dali': 5,
            'harry potter': 6,
            'nicholas flamel': 7,
       }

        self.cacheIndices = {
                'level two cache' : 2,
                'level 2 cache' : 2,
                'level two cash' : 2,
                'level 2 cash' : 2
                }
 
        self.remove_command = 'vaseline'

    def parse_stage_command(self, text):
        for command in self.stageIndices:
            if command in text.lower():
                return (self.stageIndices[command], self.remove_command in text.lower())

        return (None, None)
    
    def parse_cache_command(self, text):
        for command in self.cacheIndices:
                if command in text.lower():
                    return self.cacheIndices[command]
        return None

            
