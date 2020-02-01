

class SpokenCommandManager():

    def __init__(self):
        self.stageIndices = {
            'davinci': 0,
            'level one cache' : 0,
            'level 1 cache' : 0,
            'level one cash' : 0,
            'level 1 cash' : 0,
            'l1 cash' : 0,
            'l1 cache' : 0,
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
                'level to cache' : 2,
                'level two cash' : 2,
                'level 2 cash' : 2,
                'level to cash' : 2,
                'l2 cash' : 2,
                'l2 cache' : 2,
                'level three cache' : 3,
                'level 3 cache' : 3,
                'level three cash' : 3,
                'level 3 cash' : 3,
                'l3 cash' : 3,
                'l3 cache' : 3,
                'annotation' : -1,
                'havana station' : -1, 
                'to do cache' : -2,
                'to do cash' : -2
                }
 
        self.remove_commands = ['vaseline', 'remove']

    def parse_stage_command(self, text):
        remove = False
        for rmCmd in self.remove_commands:
            if rmCmd in text.lower():
                remove = True
        for command in self.stageIndices:
            if command in text.lower():
                return (self.stageIndices[command], remove)

        return (None, None)
    
    def parse_cache_command(self, text):
        for command in self.cacheIndices:
                if command in text.lower():
                    last = command.split()[-1:][0]
                    print(text, last)
                    return self.cacheIndices[command], text[text.find(last)+len(last)+1:]
        return None, None

            
