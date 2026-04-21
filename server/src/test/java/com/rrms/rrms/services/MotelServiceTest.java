package com.rrms.rrms.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.rrms.rrms.dto.request.MotelRequest;
import com.rrms.rrms.dto.response.MotelResponse;
import com.rrms.rrms.enums.ErrorCode;
import com.rrms.rrms.exceptions.AppException;
import com.rrms.rrms.mapper.AccountMapper;
import com.rrms.rrms.mapper.MotelMapper;
import com.rrms.rrms.models.Account;
import com.rrms.rrms.models.Motel;
import com.rrms.rrms.repositories.MotelRepository;
import com.rrms.rrms.services.servicesImp.MotelService;

import lombok.extern.slf4j.Slf4j;

@ExtendWith(MockitoExtension.class)
@Slf4j
@SuppressWarnings("unused")
class MotelServiceTest {

    @InjectMocks
    MotelService motelService;

    @Mock
    MotelRepository motelRepository;

    @Mock
    MotelMapper motelMapper;

    @Mock
    AccountMapper accountMapper;

    Motel motel;
    MotelRequest motelRequest;
    MotelResponse motelResponse;
    UUID motelId;
    private String username = "testUser";
    private Account account;

    @BeforeEach
    void init() {
        motel = Motel.builder().motelName("Motel 1").address("456 Main St").build();
        motelResponse = MotelResponse.builder()
                .motelName("Motel 1")
                .address("456 Main St")
                .build();

        motelId = UUID.randomUUID();
        motel = Motel.builder()
                .motelId(motelId)
                .motelName("Motel 1")
                .address("456 Main St")
                .build();

        motelRequest = MotelRequest.builder()
                .motelName("Updated Motel 1")
                .address("789 New St")
                .build();

        motelResponse = MotelResponse.builder()
                .motelName("Updated Motel 1")
                .address("789 New St")
                .build();
        account = new Account();
    }

    @Test
    void findAll_success() {
        List<Motel> motels = List.of(motel);
        when(motelRepository.findAll()).thenReturn(motels);

        MotelResponse mappedResponse = MotelResponse.builder()
                .motelName("Motel 1")
                .address("456 Main St")
                .build();

        when(motelMapper.motelToMotelResponse(motel)).thenReturn(mappedResponse);

        List<MotelResponse> response = motelService.findAll();

        log.info(response.toString());
        assertEquals(1, response.size());
        assertEquals("Motel 1", response.get(0).getMotelName());

        verify(motelRepository).findAll();
        verify(motelMapper).motelToMotelResponse(motel);
    }

    @Test
    void findAll_whenNoMotels_returnsEmptyList() {
        when(motelRepository.findAll()).thenReturn(List.of());

        List<MotelResponse> response = motelService.findAll();

        assertTrue(response.isEmpty());
        verify(motelRepository).findAll();
        verifyNoInteractions(motelMapper);
    }

    @Test
    void update_whenMotelExists_returnsUpdatedMotelResponse() {
        when(motelRepository.findById(motelId)).thenReturn(Optional.of(motel));
        when(motelRepository.save(motel)).thenReturn(motel);
        when(motelMapper.motelToMotelResponse(motel)).thenReturn(motelResponse);
        when(accountMapper.toAccount(any())).thenReturn(null);

        MotelResponse response = motelService.update(motelId, motelRequest);

        assertNotNull(response);
        assertEquals("Updated Motel 1", response.getMotelName());
        assertEquals("789 New St", response.getAddress());

        verify(motelRepository).findById(motelId);
        verify(motelRepository).save(motel);
        verify(motelMapper).motelToMotelResponse(motel);
        verify(accountMapper).toAccount(any());
    }

    @Test
    void update_whenMotelDoesNotExist_throwsAppException() {
        when(motelRepository.findById(motelId)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> motelService.update(motelId, motelRequest));

        assertEquals(ErrorCode.MOTEL_NOT_FOUND, exception.getErrorCode());
        verify(motelRepository).findById(motelId);
        verifyNoMoreInteractions(motelRepository);
        verifyNoInteractions(motelMapper);
    }

    @Test
    void delete_whenMotelExists_callsDeleteById() {
        UUID existingMotelId = UUID.randomUUID();
        Motel existingMotel = Motel.builder()
                .motelId(existingMotelId)
                .motelName("Motel 1")
                .address("456 Main St")
                .build();

        when(motelRepository.findById(existingMotelId)).thenReturn(Optional.of(existingMotel));

        motelService.delete(existingMotelId);

        verify(motelRepository).findById(existingMotelId);
        verify(motelRepository).deleteById(existingMotelId);
    }

    @Test
    void delete_whenMotelDoesNotExist_throwsAppException() {
        UUID missingMotelId = UUID.randomUUID();
        when(motelRepository.findById(missingMotelId)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> motelService.delete(missingMotelId));

        assertEquals(ErrorCode.MOTEL_NOT_FOUND, exception.getErrorCode());
        verify(motelRepository).findById(missingMotelId);
        verify(motelRepository, never()).deleteById(missingMotelId);
    }

    @Test
    void testFindMotelByAccountUsername() {
        List<Motel> motels = Arrays.asList(motel);
        when(motelRepository.findMotelByAccount_Username(username)).thenReturn(motels);
        when(motelMapper.motelToMotelResponse(motel)).thenReturn(motelResponse);

        List<MotelResponse> actualResponses = motelService.findMotelByAccount_Username(username);

        assertEquals(1, actualResponses.size());
        assertEquals(motelResponse, actualResponses.get(0));
        verify(motelRepository).findMotelByAccount_Username(username);
        verify(motelMapper).motelToMotelResponse(motel);
    }
}
