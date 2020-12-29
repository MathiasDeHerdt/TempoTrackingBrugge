from bluepy import btle
test_pheri = "d9:aa:73:97:3b:0a"
test_uuid = "e9dab8c2-403d-416e-8029-7ebf83b01681"


def scan():
    print("Peripheral...")
    device = btle.Peripheral()
    print("Connecting...")
    device.connect(test_pheri, btle.ADDR_TYPE_RANDOM)
    print("UUID...")
    uuid = btle.UUID(test_uuid)
    print("Service...")
    serv = device.getServiceByUUID(uuid)

    for ch in serv.getCharacteristics():
        print(str(ch))


try:
    scan()
    print("finish program")
except:
  print("An exception occurred") 

