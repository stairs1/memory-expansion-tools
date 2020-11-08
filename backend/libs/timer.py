class SpeechTimer:
    """
    holds a reference to our dict object that holds all of the transcribe sessions.
    every x seconds, it checks to see if we have any streams that haven't been used in too long, and it kills them
    """
