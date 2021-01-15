import math_triangle
import math


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
