const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const { User, SocialAccount } = require('../models');
require('dotenv').config();

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id, {
            include: ['roles']
        });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.FRONTEND_URL}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if social account exists
        let socialAccount = await SocialAccount.findOne({
            where: {
                provider: 'google',
                provider_id: profile.id
            }
        });

        if (!socialAccount) {
            // Create new social account
            socialAccount = await SocialAccount.create({
                provider: 'google',
                provider_id: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                picture: profile.photos[0].value
            });

            // Create new user
            const user = await User.create({
                email: profile.emails[0].value,
                name: profile.displayName,
                is_active: true
            });

            // Set user for social account
            await socialAccount.setUser(user);

            // Assign default role
            const userRole = await Role.findOne({ where: { name: 'user' } });
            await user.addRole(userRole);

            return done(null, user);
        }

        // User exists, return user
        const user = await socialAccount.getUser();
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Kakao Strategy
passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    callbackURL: `${process.env.FRONTEND_URL}/api/auth/kakao/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let socialAccount = await SocialAccount.findOne({
            where: {
                provider: 'kakao',
                provider_id: profile.id
            }
        });

        if (!socialAccount) {
            socialAccount = await SocialAccount.create({
                provider: 'kakao',
                provider_id: profile.id,
                email: profile._json.kakao_account.email,
                name: profile._json.properties.nickname,
                picture: profile._json.properties.profile_image
            });

            const user = await User.create({
                email: profile._json.kakao_account.email,
                name: profile._json.properties.nickname,
                is_active: true
            });

            await socialAccount.setUser(user);

            const userRole = await Role.findOne({ where: { name: 'user' } });
            await user.addRole(userRole);

            return done(null, user);
        }

        const user = await socialAccount.getUser();
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// Naver Strategy
passport.use(new NaverStrategy({
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
    callbackURL: `${process.env.FRONTEND_URL}/api/auth/naver/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let socialAccount = await SocialAccount.findOne({
            where: {
                provider: 'naver',
                provider_id: profile.id
            }
        });

        if (!socialAccount) {
            socialAccount = await SocialAccount.create({
                provider: 'naver',
                provider_id: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                picture: profile._json.profile_image
            });

            const user = await User.create({
                email: profile.emails[0].value,
                name: profile.displayName,
                is_active: true
            });

            await socialAccount.setUser(user);

            const userRole = await Role.findOne({ where: { name: 'user' } });
            await user.addRole(userRole);

            return done(null, user);
        }

        const user = await socialAccount.getUser();
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport; 