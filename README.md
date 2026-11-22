# Mohan Dairy — full site + Supabase auth (GitHub-ready)

This is everything together: the complete website file, plus the
Supabase pieces, in one folder you can push straight to GitHub.

## What's in here
- **index.html** — your full site: header, homepage, products, cart,
  gallery, reviews, the Login page, and the owner admin panel. This is
  the same file as your published preview, exported in full this time.
- **auth.js** — real Supabase calls for Mobile OTP, Email OTP, and
  Google login (see "Wire it up" below — this needs one manual step).
- **supabase-client.js** / **orders.js** / **schema.sql** — from
  before, for storing orders/customers in Supabase.

## Important: what still needs wiring, and why
`index.html` right now only *simulates* OTP login (a "Send OTP" click
just shows a toast — no real SMS goes out). That's because the page
was built inside a sandboxed preview that can't call outside services
at all. Now that it's a plain file on GitHub, it *can* — but making
that real takes one manual edit, described below, rather than just
dropping `auth.js` in next to it.

## 1. Set up Supabase Auth providers
In your Supabase project, **Authentication → Providers**:
- **Phone:** toggle it on, then connect an SMS provider underneath it
  (Twilio is the most common) — paste its Account SID/Auth Token in.
  Supabase doesn't send SMS on its own; it needs this.
- **Email:** works with Supabase's built-in mailer for testing, or your
  own SMTP for real volume.
- **Google:** create an OAuth Client ID/Secret in Google Cloud Console,
  paste them in here, and add the redirect URL Supabase shows you back
  into Google's allowed list.

No custom table is needed just for login — Supabase manages its own
`auth.users` table automatically.

## 2. Add the Supabase script to index.html
Near the bottom of `index.html`, just before `</body>`, add:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script type="module" src="auth.js"></script>
```

In `auth.js`, fill in your real `SUPABASE_URL` and
`SUPABASE_PUBLISHABLE_KEY` (publishable/anon key only — never the
secret key, see the earlier warning about that).

## 3. Wire the three buttons (the one manual step)
Open `index.html` and find this block inside the big `<script>`:

```js
if(d.sendotp!==undefined){
 const mobile=$('#acmob').value.trim();
 if(!/^\d{10}$/.test(mobile)){$('#acm').textContent='Please enter a valid 10-digit mobile number.';return}
 let saved={};try{saved=JSON.parse(localStorage.getItem('md_profile')||'{}')}catch(err){}
 try{localStorage.setItem('md_profile',JSON.stringify({...saved,mobile}))}catch(err){}
 otpSent=true;
 toast('OTP sent (placeholder — no SMS sent yet)');
 return render();
}
if(d.resendotp!==undefined){
 toast('OTP resent (placeholder — no SMS sent yet)');
 return;
}
if(d.verifyotp!==undefined){
 const otp=$('#acotp').value.trim();
 if(!otp){$('#acm').textContent='Please enter the OTP.';return}
 toast('Logged in successfully');
 otpSent=false;
 $('#acm').textContent='';
 return render();
}
```

Replace it with this (which calls the real functions in `auth.js`):

```js
if(d.sendotp!==undefined){
 const mobile=$('#acmob').value.trim();
 if(!/^\d{10}$/.test(mobile)){$('#acm').textContent='Please enter a valid 10-digit mobile number.';return}
 try{
  await sendMobileOtp(mobile);
  let saved={};try{saved=JSON.parse(localStorage.getItem('md_profile')||'{}')}catch(err){}
  try{localStorage.setItem('md_profile',JSON.stringify({...saved,mobile}))}catch(err){}
  otpSent=true;
  toast('OTP sent to your phone');
 }catch(err){showAlert('Could not send OTP: '+(err.message||err))}
 return render();
}
if(d.resendotp!==undefined){
 const mobile=$('#acmob').value.trim();
 try{await sendMobileOtp(mobile);toast('OTP resent')}catch(err){showAlert('Could not resend OTP: '+(err.message||err))}
 return;
}
if(d.verifyotp!==undefined){
 const mobile=$('#acmob').value.trim(),otp=$('#acotp').value.trim();
 if(!otp){$('#acm').textContent='Please enter the OTP.';return}
 try{
  await verifyMobileOtp(mobile,otp);
  toast('Logged in successfully');
  otpSent=false;
  $('#acm').textContent='';
 }catch(err){$('#acm').textContent='Incorrect or expired OTP.'}
 return render();
}
```

And add this import near the very top of that same `<script>` block
(this requires the script tag to be `type="module"` — change
`<script>` to `<script type="module">` where this big script starts):
```js
import { sendMobileOtp, verifyMobileOtp } from './auth.js';
```

## 4. What still uses this chat's own storage, not Supabase yet
Products, reviews, homepage photos, gallery photos, the "Why Us"
cards, and cart orders are still reading/writing through the system
built for the chat preview (`window.claude.use('db')` /
`window.claude.use('assets')`) — those calls simply do nothing on a
normal GitHub-hosted page, so the site will fall back to showing its
built-in sample data, and the owner admin panel won't be able to save
changes.

If you want those connected to Supabase too (so your real product
list, photos, and orders persist for good), that's a further step —
just ask, and I'll migrate that part next using the `orders.js` /
`schema.sql` already here as the starting point.
