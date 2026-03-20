package com.bengregory.notes.service;

import com.warrenstrange.googleauth.GoogleAuthenticatorKey;

public interface ITotpService {

    GoogleAuthenticatorKey generateSecret();

    String getQRCodeUrl(GoogleAuthenticatorKey secret, String username);

    boolean verifyCode(String secret, int code);
}
