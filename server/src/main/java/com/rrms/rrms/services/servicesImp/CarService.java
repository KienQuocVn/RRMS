package com.rrms.rrms.services.servicesImp;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rrms.rrms.dto.request.CarRequest;
import com.rrms.rrms.dto.response.CarResponse;
import com.rrms.rrms.models.Car;
import com.rrms.rrms.models.Room;
import com.rrms.rrms.repositories.CarRepository;
import com.rrms.rrms.repositories.RoomRepository;
import com.rrms.rrms.services.ICarService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CarService implements ICarService {

    private final CarRepository carRepository;

    private final RoomRepository roomRepository;

    private final com.rrms.rrms.repositories.TenantRepository tenantRepository;

    @Override
    public CarResponse createCar(CarRequest carRequest) {
        Room room = roomRepository
                .findById(carRequest.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room khÃ´ng tá»“n táº¡i"));

        com.rrms.rrms.models.Tenant tenant = null;
        if (carRequest.getTenantId() != null) {
            tenant = tenantRepository
                    .findById(carRequest.getTenantId())
                    .orElseThrow(() -> new IllegalArgumentException("KhÃ¡ch thuÃª khÃ´ng tá»“n táº¡i"));
        }

        Car car = new Car();
        car.setName(carRequest.getName());
        car.setNumber(carRequest.getNumber());
        car.setImage(carRequest.getImage());
        car.setRoom(room);
        car.setTenant(tenant);

        Car savedCar = carRepository.save(car);

        return mapToResponse(savedCar);
    }

    @Override
    public CarResponse getCarById(UUID carId) {
        Car car =
                carRepository.findById(carId).orElseThrow(() -> new IllegalArgumentException("Car khÃ´ng tá»“n táº¡i"));

        return mapToResponse(car);
    }

    @Override
    public List<CarResponse> getAllCars() {
        return carRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public CarResponse updateCar(UUID carId, CarRequest carRequest) {
        Car car =
                carRepository.findById(carId).orElseThrow(() -> new IllegalArgumentException("Car khÃ´ng tá»“n táº¡i"));

        Room room = roomRepository
                .findById(carRequest.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room khÃ´ng tá»“n táº¡i"));

        com.rrms.rrms.models.Tenant tenant = null;
        if (carRequest.getTenantId() != null) {
            tenant = tenantRepository
                    .findById(carRequest.getTenantId())
                    .orElseThrow(() -> new IllegalArgumentException("KhÃ¡ch thuÃª khÃ´ng tá»“n táº¡i"));
        }

        car.setName(carRequest.getName());
        car.setNumber(carRequest.getNumber());
        car.setImage(carRequest.getImage());
        car.setRoom(room);
        car.setTenant(tenant);

        Car updatedCar = carRepository.save(car);

        return mapToResponse(updatedCar);
    }

    @Override
    public void deleteCar(UUID carId) {
        if (!carRepository.existsById(carId)) {
            throw new IllegalArgumentException("Car khÃ´ng tá»“n táº¡i");
        }

        carRepository.deleteById(carId);
    }

    @Override
    public List<CarResponse> getCarsByRoomId(UUID roomId) {
        List<Car> cars = carRepository.findByRoom_RoomId(roomId); // Sá»­ dá»¥ng phÆ°Æ¡ng thá»©c tá»« repository
        if (cars.isEmpty()) {
            throw new IllegalArgumentException("KhÃ´ng cÃ³ xe nÃ o trong phÃ²ng nÃ y");
        }
        return cars.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<CarResponse> getCarsByMotelId(UUID motelId) {
        List<Car> cars = carRepository.findByRoom_Motel_MotelId(motelId);
        return cars.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private CarResponse mapToResponse(Car car) {
        CarResponse response = new CarResponse();
        response.setCarId(car.getCarId());
        response.setName(car.getName());
        response.setNumber(car.getNumber());
        response.setImage(car.getImage());
        response.setRoomId(car.getRoom().getRoomId());
        if (car.getTenant() != null) {
            response.setTenantId(car.getTenant().getTenantId());
            response.setTenantName(car.getTenant().getFullName());
        }
        return response;
    }
}
