package com.rrms.rrms.mapper;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.request.MotelRequest;
import com.rrms.rrms.dto.response.MotelResponse;
import com.rrms.rrms.dto.response.MotelServiceResponse;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.models.MotelService;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MotelMapper {
    @Mapping(target = "motelServices", source = "motelServices")
    MotelResponse motelToMotelResponse(Motel motel);

    Motel motelRequestToMotel(MotelRequest motelRequest);

    @Mapping(target = "motelId", source = "motel.motelId") // Ã¡nh xáº¡ motelId
    MotelServiceResponse motelServiceToMotelServiceResponse(MotelService motelService); // thÃªm Ã¡nh xáº¡ má»›i

    // PhÆ°Æ¡ng thá»©c máº·c Ä‘á»‹nh Ä‘á»ƒ Ã¡nh xáº¡ danh sÃ¡ch motel services
    default List<MotelServiceResponse> mapMotelServices(List<MotelService> motelServices) {
        if (motelServices == null) {
            return Collections.emptyList();
        }
        return motelServices.stream()
                .map(this::motelServiceToMotelServiceResponse)
                .collect(Collectors.toList());
    }
}
