package com.rrms.rrms.services.servicesImp;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.rrms.rrms.services.IMailService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class MailService implements IMailService {

    private final JavaMailSender sender;

    public MailService(JavaMailSender sender) {
        this.sender = sender;
    }

    private boolean sendMail(String to, String subject, String text) {
        MimeMessage mimeMessage = sender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, true);
            sender.send(mimeMessage);
            return true;
        } catch (MessagingException e) {
            log.error("Failed to send email to={} subject={}", to, subject, e);
            return false;
        }
    }

    @Override
    public boolean Send_ForgetPassword(String to, String subject, String text) {
        String content = "<!DOCTYPE html>"
                + "<html>"
                + "<head><style>"
                + ".email-container { font-family: Arial, sans-serif; color: #333333; }"
                + ".header { font-size: 24px; font-weight: bold; color: #20a9e7; text-align: center; }"
                + ".content { font-size: 16px; line-height: 1.6; margin-top: 20px; }"
                + ".image { text-align: center; margin-top: 20px; }"
                + ".code { font-size: 24px; font-weight: bold; }"
                + "</style></head>"
                + "<body>"
                + "<div class='email-container'>"
                + "<div class='header'>" + subject + "</div>"
                + "<div class='content'>"
                + "<p>Mã xác thực của bạn là</p>"
                + "<p class='code'>" + text + "</p>"
                + "<p>Tuyệt đối KHÔNG chia sẻ mã xác thực cho bất kì ai dưới bất kì hình thức nào.</p>"
                + "</div>"
                + "<div class='image' style='width: 300px; overflow: hidden;'>"
                + "<img src='https://firebasestorage.googleapis.com/v0/b/rrms-b7c18.appspot.com/o/images%2Flogo.png?alt=media&token=719c4675-1dc4-42d2-af36-ec52626519e4' style='width: 100%; object-fit: cover;'>"
                + "</div>"
                + "</div>"
                + "</body></html>";
        try {
            return sendMail(to, subject, content);
        } catch (Exception e) {
            log.error("Unexpected error while building/sending mail to={} subject={}", to, subject, e);
            return false;
        }
    }
}
