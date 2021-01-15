import math
#https://www.driehoekberekenen.nl/hoogte/
#https://xaktly.com/MathNonRightTrig.html


def get_triangle_corner_angle(a, b, c):
    a2 = pow(a,2)
    b2 = pow(b,2)
    c2 = pow(c,2)
    return math.acos((b2 + c2 - a2) / (2 * b * c)) #angle of A

def get_triangle_height(side_a, angle_b):
    return side_a * math.sin(angle_b)


def get_speed(distance, time):
    return distance/time

def get_time(distance, speed):
    return distance/speed