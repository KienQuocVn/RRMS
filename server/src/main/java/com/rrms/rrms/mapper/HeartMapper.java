package com.rrms.rrms.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.rrms.rrms.dto.response.HeartResponse;
import com.rrms.rrms.models.Heart;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface HeartMapper {
    HeartResponse heartToHeartResponse(Heart heart);
}
