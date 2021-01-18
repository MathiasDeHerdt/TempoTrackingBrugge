import math
#https://www.driehoekberekenen.nl/hoogte/
#https://xaktly.com/MathNonRightTrig.html


def get_triangle_corner_angle(a, b, c):
    try:
            a2 = pow(a,2)
            b2 = pow(b,2)
            c2 = pow(c,2)
            angle_a = math.acos((b2 + c2 - a2) / (2 * b * c)) #angle of A
            return angle_a
    except:
        return None

def get_max_side(a, b):
    return a + b

def get_min_side(a, b):
    if(a > b):
        return a - b
    return b - a

def calculate_sides(distance_to_rpi, distance_to_esp, width_finish):
    max_rpi_finish = get_max_side(distance_to_esp, width_finish)
    min_rpi_finish = get_min_side(distance_to_esp, width_finish)

    max_esp_finish = get_max_side(distance_to_rpi, width_finish)
    min_esp_finish = get_min_side(distance_to_rpi, width_finish)

    was_changed = 0
    if(distance_to_rpi > max_rpi_finish):
        distance_to_rpi = max_rpi_finish - 0.001
        was_changed = 1
    if(min_rpi_finish > distance_to_rpi):
        distance_to_rpi = min_rpi_finish + 0.001
        was_changed = 1

    if(distance_to_esp > max_esp_finish):
        distance_to_esp = max_esp_finish - 0.001
        was_changed = 1
    if(min_esp_finish > distance_to_esp):
        distance_to_esp = min_esp_finish + 0.001
        was_changed = 1

    return [was_changed, distance_to_rpi, distance_to_esp]


def get_triangle_height(side_a, angle_b):
    try:
        height = side_a * math.sin(angle_b)
        return height
    except:
        return None


def get_speed(distance, time):
    try:
        return distance/time
    except:
        return None


def get_time(distance, speed):
    try:
        return distance/speed
    except:
        return None





def __test():
    if __name__ == '__main__':
        try:
            a = 6 / 100
            b = 11.75 / 100
            c = 12 / 100
            angle_a = math_triangle.get_triangle_corner_angle(a, b, c)
            angle_b = math_triangle.get_triangle_corner_angle(b, c, a)
            angle_c = math_triangle.get_triangle_corner_angle(c, a, b)
            print(f'angle_a = {angle_a} - {math.degrees(angle_a)}')
            print(f'angle_b = {angle_b} - {math.degrees(angle_b)}')
            print(f'angle_c = {angle_c} - {math.degrees(angle_c)}')
            height = math_triangle.get_triangle_height(b, angle_a)
            print(f'height = {height * 100}')
        except:
            print("error accessing bluetooth device...")
            sys.exit(1)