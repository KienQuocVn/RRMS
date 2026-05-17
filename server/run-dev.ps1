$ErrorActionPreference = "Stop"

# Compile first so MapStruct/Lombok annotation processors generate mapper implementations
# before Spring Boot starts. This avoids missing bean errors such as AccountMapper.
& "$PSScriptRoot\mvnw.cmd" "-Dmaven.test.skip=true" "spring-boot:run" "-Dspring-boot.run.profiles=dev"
exit $LASTEXITCODE
