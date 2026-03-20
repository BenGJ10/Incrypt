package com.bengregory.notes.service;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import org.springframework.stereotype.Service;

@Service
public class TotpService implements ITotpService{
    /* 
        This service handles Time-based One-Time Password (TOTP) generation and verification for 2FA.
        It uses the Google Authenticator library to create secrets, generate QR codes for user setup, and verify 
        codes entered by users during login. The QR code URL can be scanned by apps like Google Authenticator to set up 2FA.
    */

    private final GoogleAuthenticator googleAuth;


    public TotpService(GoogleAuthenticator googleAuth) {
        this.googleAuth = googleAuth;
    }

    public TotpService() {
        this.googleAuth = new GoogleAuthenticator();
    }

    @Override
    // Generate a new secret key for TOTP
    public GoogleAuthenticatorKey generateSecret(){
        return googleAuth.createCredentials();
    }

    @Override
    // Generate a QR code URL for the user to scan with their authenticator app
    public String getQRCodeUrl(GoogleAuthenticatorKey secret, String username){
        return GoogleAuthenticatorQRGenerator.getOtpAuthURL("Incrypt", username, secret);
    }

    @Override
    // Verify the TOTP code entered by the user against the secret key
    public boolean verifyCode(String secret, int code){
        return googleAuth.authorize(secret, code);
    }


}
