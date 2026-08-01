package com.rrms.rrms.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rrms.rrms.models.ResidenceTemplate;

public interface ResidenceTemplateRepository extends JpaRepository<ResidenceTemplate, UUID> {

    List<ResidenceTemplate> findResidenceTemplateByMotel_MotelId(UUID motelId);
}
