## What is an XSS attack?

A security vulnerability on some web apps called Cross-site scripting and is becomming more and more common.

<img width="55%" height="auto" src="/assets/images/blog/2023/july/xssblog.png" alt="Cybercriminal using website to attack victim." >

_Written by: Anthony Tornetta_

This is attack focused on the user of your website, not the website itself. The attacker may hijack a user session, capture keystrokes, steal critical user information and more.

When you have a form or a search bar, there is the potential for an attacker to insert code on the client side that will allow them to steal their login information, by grabbing a legitimate user's stored cookies, tokens and other information stored by the browser.

They will send the user to a fake url and store their information on a server.

The user can trigger the malicious script a number of ways such as loading the page, hovering over specific elements such as hyperlinks. Attackers can carry out XSS directly by sending them an email that look legitamate, but sends them to a fake page.

Once the attacker has this information, they can easily log into a customer's account and steal their credit card information, address and another other information stored on a legitimate website server. The cybercriminal will frequently take over the victim's account.

The user's browser doesn't have a way to recognize malicious scripts, and it's very unlikely the user will notice an illigitamate url. Even if they did notice something is wrong with the url, it's too late, the damage has already been done.

Another measure would be to confirm the login cookie or token matches your customer's IP address. So you have a double validation.

While there are many ways to make your website more secure, one of first steps is to validate or encoding user information.

### The Bottom Line

