package com.bengregory.notes.security.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor

/* Using a custom MessageResponse class allows us to structure our response in a consistent way, making it easier for clients 
to parse and understand the response. It also allows us to include additional information in the response,
such as status codes or error details, if needed in the future. This approach promotes better maintainability and scalability of our API. */

public class MessageResponse {
    private String message;
}
