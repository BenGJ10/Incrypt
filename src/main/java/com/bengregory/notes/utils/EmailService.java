package com.bengregory.notes.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String toAddress, String resetUrl){
        try{
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toAddress);
            message.setSubject("Incrypt Account Password Reset Request");
            message.setText(buildPasswordResetMessage(resetUrl));
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Email sending failed");
        }
    }

    private String buildPasswordResetMessage(String resetUrl) {
        return """
                Hello,

                We received a request to reset your password.

                Click the link below to reset your password:
                %s

                If you did not request this, please ignore this email.

                Regards,
                Incrypt Team
                """.formatted(resetUrl);
    }
}
