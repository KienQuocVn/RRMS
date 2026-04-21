package com.rrms.rrms.controllers;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rrms.rrms.dto.response.BulletinBoardSearchResponse;
import com.rrms.rrms.services.ISearchService;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource("/test.properties")
class SearchControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    ISearchService searchService;

    ObjectMapper objectMapper;

    @BeforeEach
    void init() {
        objectMapper = new ObjectMapper();
    }

    @Test
    void getRoom_returnsListOfBulletinBoardSearchResponse() throws Exception {
        BulletinBoardSearchResponse room =
                BulletinBoardSearchResponse.builder().address("123 Main St").build();
        when(searchService.getRooms()).thenReturn(List.of(room));

        mockMvc.perform(MockMvcRequestBuilders.get("/searchs").contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(HttpStatus.OK.value()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result[0].address").value("123 Main St"));
    }

    @Test
    void getRoom_whenNoRooms_returnsEmptyList() throws Exception {
        when(searchService.getRooms()).thenReturn(List.of());

        mockMvc.perform(MockMvcRequestBuilders.get("/searchs").contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(HttpStatus.OK.value()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result").isEmpty());
    }

    @Test
    void getRoomsSortedByPrice_whenSortOrderDesc_callsDescService() throws Exception {
        BulletinBoardSearchResponse room =
                BulletinBoardSearchResponse.builder().address("Descending St").build();
        when(searchService.getRoomsSortedByPriceDESC()).thenReturn(List.of(room));

        mockMvc.perform(MockMvcRequestBuilders.get("/search/asc")
                        .param("sortOrder", "DESC")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(HttpStatus.OK.value()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result[0].address").value("Descending St"));

        verify(searchService).getRoomsSortedByPriceDESC();
    }

    @Test
    void getRoom_supportsVersionedAliasRoute() throws Exception {
        BulletinBoardSearchResponse room =
                BulletinBoardSearchResponse.builder().address("Alias Street").build();
        when(searchService.getRooms()).thenReturn(List.of(room));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/search").contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(HttpStatus.OK.value()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result[0].address").value("Alias Street"));
    }

    @Test
    void getRoomHomeDateNew_returnsListOfBulletinBoardSearchResponse() throws Exception {
        BulletinBoardSearchResponse room = BulletinBoardSearchResponse.builder()
                .address("123 Main St")
                .createdDate(new Date())
                .build();
        when(searchService.findAllByDatenew()).thenReturn(List.of(room));

        mockMvc.perform(MockMvcRequestBuilders.get("/searchs/roomNews").contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(HttpStatus.OK.value()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result[0].address").value("123 Main St"));
    }

    @Test
    void getRoomHomeDateNew_whenNoRooms_returnsEmptyList() throws Exception {
        when(searchService.findAllByDatenew()).thenReturn(List.of());

        mockMvc.perform(MockMvcRequestBuilders.get("/searchs/roomNews").contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(HttpStatus.OK.value()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result").isEmpty());
    }

    @Test
    void getRoomHomeDateNewVieux_returnsListOfBulletinBoardSearchResponse() throws Exception {
        BulletinBoardSearchResponse room = BulletinBoardSearchResponse.builder()
                .address("456 Old St")
                .createdDate(new Date())
                .build();
        when(searchService.findAllByIsActive()).thenReturn(List.of(room));

        mockMvc.perform(MockMvcRequestBuilders.get("/searchs/roomVieux").contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(HttpStatus.OK.value()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result[0].address").value("456 Old St"));
    }

    @Test
    void getRoomHomeDateNewVieux_whenNoRooms_returnsEmptyList() throws Exception {
        when(searchService.findAllByIsActive()).thenReturn(List.of());

        mockMvc.perform(MockMvcRequestBuilders.get("/searchs/roomVieux").contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(HttpStatus.OK.value()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result").isEmpty());
    }

    @Test
    void searchAddress_returnsListOfBulletinBoardSearchResponse() throws Exception {
        BulletinBoardSearchResponse room = BulletinBoardSearchResponse.builder()
                .address("123 Main St")
                .createdDate(new Date())
                .build();
        when(searchService.listRoomByAddress("123 Main St")).thenReturn(List.of(room));

        mockMvc.perform(MockMvcRequestBuilders.get("/searchs/addressBullet")
                        .param("address", "123 Main St")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(HttpStatus.OK.value()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result[0].address").value("123 Main St"));
    }

    @Test
    void searchAddress_whenNoRoomsFound_returnsEmptyList() throws Exception {
        when(searchService.listRoomByAddress("Nonexistent Address")).thenReturn(List.of());

        mockMvc.perform(MockMvcRequestBuilders.get("/searchs/addressBullet")
                        .param("address", "Nonexistent Address")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.code").value(HttpStatus.OK.value()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.result").isEmpty());
    }
}
