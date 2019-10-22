/*
 * This code is deployed on AWS Lambda and run on the Cognito confirmation message trigger.
 * Environment Variables:
 * COGNITO_USER_POOL_ID: []
 * WEBSITE: https://root.treehacks.com
 */
exports.handler = (event, context, callback) => {
    //
    if (event.userPoolId === process.env.COGNITO_USER_POOL_ID) {
        // Identify why was this function invoked
        if (event.triggerSource === "CustomMessage_SignUp" ||
            event.triggerSource === "CustomMessage_ResendCode") {
            // Ensure that your message contains event.request.codeParameter. This is the placeholder for code that will be sent
            event.response.emailSubject = "Verify your TreeHacks account";
            let website = process.env.WEBSITE;
            let link = `${website}/verify?username=${event.request.userAttributes.sub}&code=${event.request.codeParameter}`;
            event.response.emailMessage = `
<!doctype html> <html xmlns=http://www.w3.org/1999/xhtml xmlns:v=urn:schemas-microsoft-com:vml xmlns:o=urn:schemas-microsoft-com:office:office> <head> <meta charset=UTF-8> <meta http-equiv=X-UA-Compatible content="IE=edge"> <meta name=viewport content="width=device-width, initial-scale=1"> <title>🌲 Verify Your Email for TreeHacks 🌲</title> <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i|Montserrat:400,400i,700,700i" rel=stylesheet> </head> <body style=height:100%;margin:0;padding:0;width:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#fff7f9> <span class=mcnPreviewText style=font-size:0;line-height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;visibility:hidden;mso-hide:all;display:none></span> <center> <table align=center border=0 cellpadding=0 cellspacing=0 height=100% width=100% id=bodyTable style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;height:100%;margin:0;padding:0;width:100%;background-color:#fff7f9 bgcolor=white> <tr> <td align=center valign=top id=bodyCell style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;height:100%;margin:0;padding:10px;width:100%;border-top:0 width=100% height=100%> <table border=0 cellpadding=0 cellspacing=0 width=100% class=templateContainer style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;border:0;max-width:600px> <tr> <td valign=top id=templatePreheader style="background-repeat:no-repeat;background:#fff none no-repeat center/cover;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#fff;background-image:none;mso-line-height-rule:exactly;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:9px;padding-bottom:9px" bgcolor=#ffffff background=none></td> </tr> <tr> <td valign=top id=templateHeader style="background-repeat:no-repeat;background:#fff none no-repeat center/cover;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#fff;background-image:none;mso-line-height-rule:exactly;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:9px;padding-bottom:0" bgcolor=#FFFFFF background=none> <table class=mcnImageBlock style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% cellspacing=0 cellpadding=0 border=0> <tbody class=mcnImageBlockOuter> <tr> <td style=padding:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% class=mcnImageBlockInner valign=top> <table class=mcnImageContentContainer style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% cellspacing=0 cellpadding=0 border=0 align=left> <tbody> <tr> <td class=mcnImageContent style=padding-right:9px;padding-left:9px;padding-top:0;padding-bottom:0;text-align:center;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top align=center> <img alt src=https://user-images.githubusercontent.com/1689183/67155138-1ca82380-f2be-11e9-9312-7a93bf3403f2.png style=max-width:7084px;padding-bottom:0;display:inline;vertical-align:bottom;border:0;height:auto;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic class=mcnImage width=564 align=middle> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td valign=top id=templateBody style="background-repeat:no-repeat;background:#fff none no-repeat center/cover;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#fff;background-image:none;mso-line-height-rule:exactly;background-position:center;background-size:cover;border-top:0;border-bottom:2px solid #eaeaea;padding-top:0;padding-bottom:9px" bgcolor=#FFFFFF background=none> <table class=mcnTextBlock style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% cellspacing=0 cellpadding=0 border=0> <tbody class=mcnTextBlockOuter> <tr> <td class=mcnTextBlockInner style=padding-top:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top> <table style=max-width:100%;min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% class=mcnTextContentContainer width=100% cellspacing=0 cellpadding=0 border=0 align=left> <tbody> <tr> <td class=mcnTextContent style=-webkit-text-size-adjust:100%;padding-top:0;padding-bottom:9px;padding-left:18px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;padding-right:18px;word-break:break-word;color:#202020;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left valign=top align=left> <table class=module data-type=text role=module style=text-transform:none;caret-color:#232323;font-family:helvetica,arial,sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-weight:normal;letter-spacing:normal;orphans:auto;text-align:left;text-indent:0;color:#232323;white-space:normal;widows:auto;word-spacing:0;-webkit-text-size-adjust:auto;-webkit-text-stroke-width:0;text-decoration:none;table-layout:fixed;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100% width=100% cellspacing=0 cellpadding=0 border=0 align=left> <tbody> <tr> <td style="padding:20px 0 0;background-color:#fff;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%" valign=top height=100% bgcolor=#FFFFFF> <h1 style=font-family:Helvetica;text-align:center;margin:0;padding:0;color:#202020;display:block;font-size:26px;font-style:normal;font-weight:bold;line-height:125%;letter-spacing:normal><span style=font-size:40px><span style=color:#E51B5D> <font face="Montserrat, Arial, sans-serif"><span style=font-weight:300>Yay!</span></font> </span></span></h1> </td> </tr> </tbody> </table> <table class=module data-type=text role=module style=text-transform:none;caret-color:#232323;font-family:helvetica,arial,sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-weight:normal;letter-spacing:normal;orphans:auto;text-align:left;text-indent:0;color:#232323;white-space:normal;widows:auto;word-spacing:0;-webkit-text-size-adjust:auto;-webkit-text-stroke-width:0;text-decoration:none;table-layout:fixed;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100% width=100% cellspacing=0 cellpadding=0 border=0 align=left> <tbody> <tr> <td style=padding:0;background-color:#fff;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top height=100% bgcolor=#FFFFFF> <h2 style=font-family:Helvetica;text-align:center;margin:0;padding:0;color:#202020;display:block;font-size:22px;font-style:normal;font-weight:bold;line-height:125%;letter-spacing:normal><br> <span style=color:#535152><strong><span style=font-family:montserrat,arial,sans-serif>Verify your email :)</span></strong></span></h2> </td> </tr> </tbody> </table> <table class=module data-type=text role=module style=text-transform:none;caret-color:#232323;font-family:helvetica,arial,sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-weight:normal;letter-spacing:normal;orphans:auto;text-align:left;text-indent:0;color:#232323;white-space:normal;widows:auto;word-spacing:0;-webkit-text-size-adjust:auto;-webkit-text-stroke-width:0;text-decoration:none;table-layout:fixed;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100% width=100% cellspacing=0 cellpadding=0 border=0 align=left> <tbody> <tr> <td style="padding:18px 0;line-height:22px;text-align:inherit;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%" valign=top height=100% bgcolor align=inherit> <div style=font-size:16px;font-family:Lato,Arial,sans-serif;font-weight:400;text-align:center><span style=color:#535152>We're so glad you took the first step to apply to TreeHacks 2020. To finish applying, you can verify your email by clicking <a href="${link}" style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#2baadf;font-weight:normal;text-decoration:underline>here</a>.<br> <br> 🌲Can't wait to read your application!🌲</span></div> <div style=font-size:16px;font-family:Lato,Arial,sans-serif;font-weight:400> </div> <div style=font-size:16px;font-family:Lato,Arial,sans-serif;font-weight:400;text-align:center><span style=color:#535152> The TreeHacks Team </span></div> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table class=mcnDividerBlock style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;table-layout:fixed width=100% cellspacing=0 cellpadding=0 border=0> <tbody class=mcnDividerBlockOuter> <tr> <td class=mcnDividerBlockInner style=min-width:100%;padding:18px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%> <table class=mcnDividerContent style="min-width:100%;border-top:2px solid #535152;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%" width=100% cellspacing=0 cellpadding=0 border=0> <tbody> <tr> <td style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%> <span></span> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table class=mcnTextBlock style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% cellspacing=0 cellpadding=0 border=0> <tbody class=mcnTextBlockOuter> <tr> <td class=mcnTextBlockInner style=padding-top:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top> <table style=max-width:100%;min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% class=mcnTextContentContainer width=100% cellspacing=0 cellpadding=0 border=0 align=left> <tbody> <tr> <td class=mcnTextContent style=-webkit-text-size-adjust:100%;padding-top:0;padding-bottom:9px;padding-left:18px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;padding-right:18px;word-break:break-word;color:#202020;font-family:Helvetica;font-size:16px;line-height:150%;text-align:left valign=top align=left> <div style=caret-color:#232323;color:#232323;font-family:helvetica,arial,sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-weight:normal;letter-spacing:normal;orphans:auto;text-indent:0;text-transform:none;white-space:normal;widows:auto;word-spacing:0;-webkit-text-size-adjust:auto;-webkit-text-stroke-width:0;background-color:#fff;text-decoration:none;text-align:center;margin-top:30px><span style=color:#535152><strong>TreeHacks 2020, February 15-17, Stanford University.</strong></span></div> <div style=caret-color:#232323;color:#232323;font-family:helvetica,arial,sans-serif;font-size:16px;font-style:normal;font-variant-caps:normal;font-weight:normal;letter-spacing:normal;orphans:auto;text-indent:0;text-transform:none;white-space:normal;widows:auto;word-spacing:0;-webkit-text-size-adjust:auto;-webkit-text-stroke-width:0;background-color:#fff;text-decoration:none;text-align:center;margin-bottom:30px><a href=https://treehacks.com style=color:#232323;text-decoration:none;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;font-weight:normal target=_blank><span style=color:#E51B5D><strong>treehacks.com</strong></span></a></div> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td valign=top id=templateFooter style="background-repeat:no-repeat;background:#fafafa none no-repeat center/cover;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;background-color:#fafafa;background-image:none;mso-line-height-rule:exactly;background-position:center;background-size:cover;border-top:0;border-bottom:0;padding-top:9px;padding-bottom:9px" bgcolor=#FAFAFA background=none> <table class=mcnFollowBlock style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% cellspacing=0 cellpadding=0 border=0> <tbody class=mcnFollowBlockOuter> <tr> <td style=padding:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% class=mcnFollowBlockInner valign=top align=center> <table class=mcnFollowContentContainer style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% width=100% cellspacing=0 cellpadding=0 border=0> <tbody> <tr> <td style=padding-left:9px;padding-right:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% align=center> <table style=min-width:100%;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% class=mcnFollowContent width=100% cellspacing=0 cellpadding=0 border=0> <tbody> <tr> <td style=padding-top:9px;padding-right:9px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=top align=center> <table cellspacing=0 cellpadding=0 border=0 align=center style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%> <tbody> <tr> <td valign=top align=center style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%> <table style=display:inline;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% cellspacing=0 cellpadding=0 border=0 align=left> <tbody> <tr> <td style=padding-right:10px;padding-bottom:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% class=mcnFollowContentItemContainer valign=top> <table class=mcnFollowContentItem width=100% cellspacing=0 cellpadding=0 border=0 style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%> <tbody> <tr> <td style=padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=middle align=left> <table width cellspacing=0 cellpadding=0 border=0 align=left style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%> <tbody> <tr> <td class=mcnFollowIconContent width=24 valign=middle align=center style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%> <a href=http://www.twitter.com/hackwithtrees target=_blank style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%><img src=https://cdn-images.mailchimp.com/icons/social-block-v2/color-twitter-48.png style=display:block;border:0;height:auto;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic class width=24 height=24></a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table style=display:inline;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% cellspacing=0 cellpadding=0 border=0 align=left> <tbody> <tr> <td style=padding-right:10px;padding-bottom:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% class=mcnFollowContentItemContainer valign=top> <table class=mcnFollowContentItem width=100% cellspacing=0 cellpadding=0 border=0 style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%> <tbody> <tr> <td style=padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=middle align=left> <table width cellspacing=0 cellpadding=0 border=0 align=left style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%> <tbody> <tr> <td class=mcnFollowIconContent width=24 valign=middle align=center style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%> <a href=http://www.facebook.com/treehacks target=_blank style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%><img src=https://cdn-images.mailchimp.com/icons/social-block-v2/color-facebook-48.png style=display:block;border:0;height:auto;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic class width=24 height=24></a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table style=display:inline;border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% cellspacing=0 cellpadding=0 border=0 align=left> <tbody> <tr> <td style=padding-right:0;padding-bottom:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% class=mcnFollowContentItemContainer valign=top> <table class=mcnFollowContentItem width=100% cellspacing=0 cellpadding=0 border=0 style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%> <tbody> <tr> <td style=padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:9px;mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100% valign=middle align=left> <table width cellspacing=0 cellpadding=0 border=0 align=left style=border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%> <tbody> <tr> <td class=mcnFollowIconContent width=24 valign=middle align=center style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%> <a href=https://treehacks.com target=_blank style=mso-line-height-rule:exactly;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%><img src=https://cdn-images.mailchimp.com/icons/social-block-v2/color-link-48.png style=display:block;border:0;height:auto;outline:0;text-decoration:none;-ms-interpolation-mode:bicubic class width=24 height=24></a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </table> </td> </tr> </table> </center> <center> <br> <br> <br> <br> <br> <br> <style type=text/css>@media only screen and (max-width:480px){table#canspamBar td{font-size:14px!important}table#canspamBar td a{display:block!important;margin-top:10px!important}}</style> </center> </body> </html>
            `;
        }
        // Create custom message for other events
    }
    // Customize messages for other user pools

    // Return to Amazon Cognito
    callback(null, event);
};