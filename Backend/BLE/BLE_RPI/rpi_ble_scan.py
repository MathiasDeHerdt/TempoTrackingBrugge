import os
import sys
import struct
import bluetooth._bluetooth as bluez

LE_META_EVENT = 0x3e
OGF_LE_CTL=0x08
OCF_LE_SET_SCAN_ENABLE=0x000C

# these are actually subevents of LE_META_EVENT
EVT_LE_CONN_COMPLETE=0x01
EVT_LE_ADVERTISING_REPORT=0x02

# my variables
dev_id = 0

def getBLESocket(devID):
	return bluez.hci_open_dev(devID)

def returnnumberpacket(pkt):
    myInteger = 0
    multiple = 256
    for i in range(len(pkt)):
        myInteger += struct.unpack("B",pkt[i:i+1])[0] * multiple
        multiple = 1
    return myInteger

def returnstringpacket(pkt):
    myString = ""
    for i in range(len(pkt)):
        myString += "%02x" %struct.unpack("B",pkt[i:i+1])[0]
    return myString

def packed_bdaddr_to_string(bdaddr_packed):
    return ':'.join('%02x'%i for i in struct.unpack("<BBBBBB", bdaddr_packed[::-1]))

def hci_enable_le_scan(sock):
    hci_toggle_le_scan(sock, 0x01)

def hci_disable_le_scan(sock):
    hci_toggle_le_scan(sock, 0x00)

def hci_toggle_le_scan(sock, enable):
    cmd_pkt = struct.pack("<BB", enable, 0x00)
    bluez.hci_send_cmd(sock, OGF_LE_CTL, OCF_LE_SET_SCAN_ENABLE, cmd_pkt)

def hci_le_set_scan_parameters(sock):
    old_filter = sock.getsockopt( bluez.SOL_HCI, bluez.HCI_FILTER, 14)

def extract_details(pkt, report_pkt_offset, sock):
    address =  str(packed_bdaddr_to_string(pkt[report_pkt_offset + 3:report_pkt_offset + 9])) #address
    uuid =  str(returnstringpacket(pkt[report_pkt_offset -22: report_pkt_offset - 6])) #uuid
    major =  str(returnstringpacket(pkt[report_pkt_offset -6: report_pkt_offset - 4])) #major
    minor = str(returnstringpacket(pkt[report_pkt_offset -4: report_pkt_offset - 2])) #minor
    txPower = ""
    name = ""
    try:
        obj = bluetooth.find_service(name=None, uuid=None, address=None)
        nameTemp = obj[""]
        name = nameTemp
    except: 1
    try:
        txPower = str(returnstringpacket(pkt[report_pkt_offset -2:report_pkt_offset -1])) #txPower
    except: 1

    major = int(major, 16)
    minor = int(minor, 16)
    txPower = complement2(int(txPower, 16))

    beacon = {
        "address" : address, 
        "name" : name,
        "uuid" : uuid, 
        "major" : major, 
        "minor" : minor, 
        "txPower" : txPower
    }
    return beacon

def complement2(value):
    return (-1)*(255 + 1 - value)  

def parse_events(sock, loop_count=100):
    old_filter = sock.getsockopt( bluez.SOL_HCI, bluez.HCI_FILTER, 14)
    flt = bluez.hci_filter_new()
    bluez.hci_filter_all_events(flt)
    bluez.hci_filter_set_ptype(flt, bluez.HCI_EVENT_PKT)
    sock.setsockopt( bluez.SOL_HCI, bluez.HCI_FILTER, flt )
    listBeacon = []
    for i in range(0, loop_count):
        pkt = sock.recv(255)
        ptype, event, plen = struct.unpack("BBB", pkt[:3])
        if event == bluez.EVT_INQUIRY_RESULT_WITH_RSSI:
            i = 0
        elif event == bluez.EVT_NUM_COMP_PKTS:
            i = 0
        elif event == bluez.EVT_DISCONN_COMPLETE:
            i = 0
        elif event == LE_META_EVENT:
            subevent, = struct.unpack("B", pkt[3:4])
            pkt = pkt[4:]
            if subevent == EVT_LE_CONN_COMPLETE:
                le_handle_connection_complete(pkt)
            elif subevent == EVT_LE_ADVERTISING_REPORT:
                num_reports = struct.unpack("B", pkt[0:1])[0]
                report_pkt_offset = 0
                for i in range(0, num_reports):
                    beacon = extract_details(pkt, report_pkt_offset, sock)
                    if beacon not in listBeacon: 
                        listBeacon.append(beacon)

    sock.setsockopt( bluez.SOL_HCI, bluez.HCI_FILTER, old_filter )
    return listBeacon

