package com.eventsphere.eventspere.service.impl;


import com.eventsphere.eventspere.entity.Event;
import com.eventsphere.eventspere.entity.User;
import com.eventsphere.eventspere.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;

@Service
public class EmailServiceImpl implements EmailService {
    private static final Logger logger =
            LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendRegistrationConfirmation(User user, Event event) {

        String subject = "EventSphere - Registration Confirmed";

        String body = """
                Hello %s,

                Your registration has been confirmed successfully!

                Event Details:
                Event: %s
                Venue: %s
                Start Time: %s

                We look forward to seeing you there!

                Regards,
                EventSphere Team
                """.formatted(
                user.getFullname(),
                event.getTitle(),
                event.getVenue(),
                event.getStartTime()
        );

        sendEmail(user.getEmail(), subject, body);
    }

    @Override
    public void sendRegistrationCancellation(User user, Event event) {

        String subject = "EventSphere - Registration Cancelled";

        String body = """
                Hello %s,

                Your registration for the following event has been cancelled successfully.

                Event Details:
                Event: %s
                Venue: %s
                Start Time: %s

                Thank you for using EventSphere.

                Regards,
                EventSphere Team
                """.formatted(
                user.getFullname(),
                event.getTitle(),
                event.getVenue(),
                event.getStartTime()
        );

        sendEmail(user.getEmail(), subject, body);
    }

    private void sendEmail(String recipient, String subject, String body) {

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(recipient);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            logger.info("Email notification sent successfully to {}", recipient);

        } catch (MailException exception) {

            logger.error(
                    "Failed to send email notification to {}: {}",
                    recipient,
                    exception.getMessage()
            );
        }
    }


}
