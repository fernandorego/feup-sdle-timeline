from Crypto.PublicKey import RSA
from Crypto.Signature.pkcs1_15 import PKCS115_SigScheme
from Crypto.Hash import SHA256

def generate_PKI_key_pair():
    '''
        Generate a Private Key Infrastructure where we 
        have a private and public key pair.

        To guarantee authenticity we need to sign every post
        each user does with the private key, and validate the 
        post using the public key in the DHT.    
    '''

    keyPair = RSA.generate(bits=4096)

    public_key = keyPair.public_key().export_key('PEM')

    private_key = keyPair.export_key('PEM')

    return public_key, private_key

def sign_message(message : str, private_key : str):
    '''
        Encrypt the message using SHA256
        and then sign the hashed message
        returns the message and the signature
    '''

    message_enconded = message.encode(encoding= 'utf-8')

    hashed_message = SHA256.new(message_enconded)

    signer = PKCS115_SigScheme(private_key)

    signature = signer.sign(hashed_message)

    return signature

def verify_signature(message: str, public_key : str, signature : bytes) -> bool:
    '''
        Given a specfic message and the signature generated
        by the PKI verify if the message received is valid
        based on the signature and using the Public key
    '''
    message_encoded = message.encode(encoding='utf-8')

    hashed_message = SHA256.new(message_encoded)

    verifier = PKCS115_SigScheme(public_key)

    try:
        verifier.verify(hashed_message, signature)
        print("Signature is valid.")
        return True
    except:
        print("Signature is invalid.")
        return False
