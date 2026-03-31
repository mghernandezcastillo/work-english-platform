# RLS Planning — English for Work

---

## Row Level Security Policies

### profiles
| Policy | Operation | Who | Rule |
|---|---|---|---|
| Users can read own profile | SELECT | Authenticated | `auth.uid() = id` |
| Users can update own profile | UPDATE | Authenticated | `auth.uid() = id` (only: full_name, onboarding_completed) |
| Admins can read all profiles | SELECT | Admin | `is_admin = true` on requesting user's profile |
| Admins can update all profiles | UPDATE | Admin | `is_admin = true` on requesting user's profile |
| Service role full access | ALL | Service role | Edge functions use service role key |

### routes, modules, lessons, simulations
| Policy | Operation | Who | Rule |
|---|---|---|---|
| Anyone with active access can read | SELECT | Authenticated | Profile `access_type` in ('beta', 'paid', 'unlimited') |
| No user writes | INSERT/UPDATE/DELETE | None | Content is managed via migrations/seed only |

### user_progress
| Policy | Operation | Who | Rule |
|---|---|---|---|
| Users can read own progress | SELECT | Authenticated | `auth.uid() = user_id` |
| Users can insert own progress | INSERT | Authenticated | `auth.uid() = user_id` |
| Users can update own progress | UPDATE | Authenticated | `auth.uid() = user_id` |
| Admins can read all progress | SELECT | Admin | `is_admin = true` on requesting user |

### testimonials
| Policy | Operation | Who | Rule |
|---|---|---|---|
| Users can insert own testimonials | INSERT | Authenticated | `auth.uid() = user_id` |
| Users can read own testimonials | SELECT | Authenticated | `auth.uid() = user_id` |
| Public can read landing testimonials | SELECT | Anon/Public | `show_on_landing = true AND status = 'approved'` |
| Admins can read all testimonials | SELECT | Admin | `is_admin = true` |
| Admins can update testimonials | UPDATE | Admin | `is_admin = true` (status, show_on_landing, display_order) |

### beta_invites
| Policy | Operation | Who | Rule |
|---|---|---|---|
| Public can read by token (to validate) | SELECT | Anon | `token = provided_token AND used_by IS NULL` |
| Admins can read all | SELECT | Admin | `is_admin = true` |
| Admins can insert | INSERT | Admin | `is_admin = true` |
| Service role can update (mark used) | UPDATE | Service role | Via edge function |

### email_log
| Policy | Operation | Who | Rule |
|---|---|---|---|
| No user access | ALL | None | Only service role (edge functions) |
| Admins can read | SELECT | Admin | `is_admin = true` |
