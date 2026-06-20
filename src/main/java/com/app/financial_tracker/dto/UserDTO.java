package com.app.financial_tracker.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
 
    private Long id;

    private String fullName;

    private String email;

    private String profilePicture;

}