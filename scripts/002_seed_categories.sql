-- Insert default categories for social media platforms
INSERT INTO categories (name, description, icon) VALUES
('FreeFire', 'FreeFire gaming accounts with various ranks and items', '🎮'),
('TikTok', 'TikTok accounts with followers and engagement', '📱'),
('Google', 'Google accounts and services', '🔍'),
('Facebook', 'Facebook accounts and pages', '📘'),
('Instagram', 'Instagram accounts with followers and content', '📷'),
('Snapchat', 'Snapchat accounts with streaks and followers', '👻'),
('YouTube', 'YouTube channels with subscribers and content', '📺')
ON CONFLICT (name) DO NOTHING;
