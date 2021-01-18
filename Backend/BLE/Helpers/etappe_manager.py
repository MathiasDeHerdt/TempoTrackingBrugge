import sys


class EtappeManager:
    # INIT
    #=================================================================================================================
    def __init__(self, etappe_count):
        self.__etappe_index = 0
        self.__etappe_count = etappe_count
        self.__etappe_array = [Etappe()] * etappe_count

    def append_measure(self, measure1, measure2, finish_width):
        #Skip if max ettape count exeeded
        if self.__etappe_index >= self.__etappe_count:
            return 2

        #Update etappe if needed
        self.__etappe_array[self.__etappe_index].append_measure(measure1, measure2, finish_width)
        has_finished_etappe = self.__etappe_array[self.__etappe_index].has_finished_etappe()
        
        #Go to next etappe if possible and tell etappe has been completed
        if has_finished_etappe == True:
            self.__etappe_index += 1
            return 1

        #No etappe completed
        return 0

    def has_finished(self):
        if self.__etappe_index >= self.__etappe_count:
                return True
        return False

    @property
    def etappe_count(self):
        return self.__etappe_count


class Etappe:
    # INIT
    #=================================================================================================================
    def __init__(self):
        self.first_distance = None
        self.shortest_distance = sys.maxsize
        self.last_distance = None

        self.last_measure = None


    def append_measure(self, measure1, measure2, finish_width):
        self.last_measure = measure1
        try:
            print(f'{measure1}')
            print(f'{measure2}')
            print(f'{finish_width}')
            print("-----------------------------------------------")
            distance = self.get_distance(measure1, measure2, finish_width)
            if distance == None:
                return
            print(f'distance to finish - {distance}m')
                
            self.last_distance = distance

            if (self.first_distance == None):
                self.first_distance = distance

            elif (self.shortest_distance.distance > distance):
                self.shortest_distance = distance

        except:
            return


    def has_finished_etappe(self):
        if  (self.first_distance == None) | (self.shortest_distance == None) | (self.last_distance == None):
            return False

        offset = self.last_distance - self.shortest_distance
        if (offset >= 3): #treshhold = 3
            print(f'treshhold passed = {offset} - {self.shortest_distance}m - {self.last_distance}m')
            return True

        return False


    def etappe_finish_time(self):  
        return self.last_measure.timestamp


    def get_distance(self, measure1, measure2, finish_width):
        a = measure1.distance
        b = measure2.distance
        c = finish_width

        angle_a = self.get_triangle_corner_angle(a, b, c)
        angle_b = self.get_triangle_corner_angle(b, c, a)

        height1 = self.get_triangle_height(b, angle_a)
        height2 = self.get_triangle_height(a, angle_b)
        if(height1 == None):
            return height2
        if(height2 == None):
            return height1
        return (height1 + height2) / 2.0


    def get_triangle_corner_angle(self, a, b, c):
        try:
                a2 = pow(a,2)
                b2 = pow(b,2)
                c2 = pow(c,2)
                angle_a = math.acos((b2 + c2 - a2) / (2 * b * c)) #angle of A
                return angle_a
        except:
            return None


    def get_triangle_height(self, side_a, angle_b):
        try:
            height = side_a * math.sin(angle_b)
            return height
        except:
            return None
        