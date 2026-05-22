from django import forms
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.http import require_POST


# ---------------------------------------------------------------------------
# Registration form
# ---------------------------------------------------------------------------

class RegisterForm(forms.Form):
    username = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={
            'class':        'cc-input',
            'placeholder':  'e.g. ada_codes, zara_01…',
            'autocomplete': 'username',
            'autofocus':    True,
        }),
    )
    email = forms.EmailField(
        required=False,
        widget=forms.EmailInput(attrs={
            'class':        'cc-input',
            'placeholder':  'optional — for password recovery',
            'autocomplete': 'email',
        }),
    )
    password1 = forms.CharField(
        label='Password',
        min_length=8,
        widget=forms.PasswordInput(attrs={
            'class':        'cc-input',
            'placeholder':  'at least 8 characters',
            'autocomplete': 'new-password',
        }),
    )
    password2 = forms.CharField(
        label='Confirm Password',
        widget=forms.PasswordInput(attrs={
            'class':        'cc-input',
            'placeholder':  'same password again',
            'autocomplete': 'new-password',
        }),
    )

    def clean_username(self):
        username = self.cleaned_data['username'].strip()
        if User.objects.filter(username__iexact=username).exists():
            raise forms.ValidationError('That username is already taken.')
        return username

    def clean(self):
        cleaned = super().clean()
        p1 = cleaned.get('password1', '')
        p2 = cleaned.get('password2', '')
        if p1 and p2 and p1 != p2:
            self.add_error('password2', 'Passwords do not match.')
        return cleaned

    def save(self):
        """Create and return the new User (not yet logged in)."""
        data = self.cleaned_data
        user = User.objects.create_user(
            username=data['username'],
            email=data.get('email', ''),
            password=data['password1'],
        )
        return user


# ---------------------------------------------------------------------------
# Registration view
# ---------------------------------------------------------------------------

def register(request):
    """
    GET  /accounts/register/  — show the registration form.
    POST /accounts/register/  — validate, create user, auto-login, redirect to
                                character creation (first-time setup).
    """
    if request.user.is_authenticated:
        return redirect('game:play')

    form = RegisterForm(request.POST or None)

    if request.method == 'POST' and form.is_valid():
        user = form.save()
        login(request, user)
        return redirect('game:character_create')

    return render(request, 'registration/register.html', {'form': form})


# ---------------------------------------------------------------------------
# Paywall / Waitlist
# ---------------------------------------------------------------------------

def paywall(request):
    """
    GET  /subscribe/   — show the paywall / upgrade page.
    Accessible to anyone who has finished Region 1 and wants to continue.
    """
    joined = request.session.pop('waitlist_joined', False)
    return render(request, 'accounts/paywall.html', {
        'joined': joined,
        'user':   request.user,
    })


@require_POST
def waitlist_join(request):
    """
    POST /subscribe/waitlist/   body: email=...
    Saves the email to WaitlistEntry (unique, so double-submits are safe).
    Returns JSON for AJAX or redirects for plain-form fallback.
    """
    from accounts.models import WaitlistEntry

    email = (request.POST.get('email') or '').strip().lower()
    is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'

    if not email or '@' not in email:
        if is_ajax:
            return JsonResponse({'ok': False, 'error': 'Enter a valid email address.'})
        return redirect('accounts:paywall')

    obj, created = WaitlistEntry.objects.get_or_create(
        email=email,
        defaults={'user': request.user if request.user.is_authenticated else None},
    )

    if is_ajax:
        return JsonResponse({'ok': True, 'created': created})

    request.session['waitlist_joined'] = True
    return redirect('accounts:paywall')
