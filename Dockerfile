# Use Alpine-based Node image for small footprint
FROM node:20-alpine

# Install required packages
RUN apk add --no-cache \
  bash \
  git \
  curl \
  python3 \
  make \
  g++ \
  libc6-compat \
  openjdk17 \
  yarn

# Set working directory
WORKDIR /app

# Install Expo CLI and EAS CLI globally
RUN npm install -g expo-cli eas-cli

# Fix for missing Android SDK repo config
RUN mkdir -p /root/.android && touch /root/.android/repositories.cfg

# Optional: Set up environment variables for Java
ENV JAVA_HOME="/usr/lib/jvm/java-17-openjdk"
ENV PATH="$JAVA_HOME/bin:$PATH"

# Optional: You can copy the project here or mount a volume when running the container
# COPY . .

# Set default shell to bash
CMD ["bash"]
