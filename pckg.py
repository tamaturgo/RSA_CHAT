from scapy.all import *


lista_de_ips = []


def tcp(pkt):
    if pkt.haslayer(TCP):
        # Filtra ip de origem
        if pkt[IP].src == "127.0.0.1":
            if pkt[IP].dst not in lista_de_ips:
                lista_de_ips.append(pkt[IP].dst)
                print("IPs: ", lista_de_ips)


# Starta o sniffing
sniff(prn=tcp, filter="ip", store=0)
