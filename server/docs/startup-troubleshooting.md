# Backend startup troubleshooting

If Spring Boot fails with an error like:

```text
Parameter N of constructor ... required a bean of type
'com.rrms.rrms.mapper.AccountMapper' that could not be found
```

the usual cause is that MapStruct did not generate `AccountMapperImpl` before the app started.

## Why this happens

`AccountMapper` is only an interface. Spring can inject it only after MapStruct generates
`AccountMapperImpl` during compilation.

When the backend is started directly from the IDE, annotation processing may be skipped.
That leaves Spring with `AccountMapper.class` but without `AccountMapperImpl.class`, so startup fails.

## Stable way to run the backend

Use one of these commands from the `server` folder:

```powershell
.\run-dev.ps1
```

or:

```powershell
.\mvnw.cmd -Dmaven.test.skip=true spring-boot:run -Dspring-boot.run.profiles=dev
```

These commands still compile the main source set so MapStruct and Lombok run before Spring Boot starts,
but they skip broken legacy test compilation.

## If you still want to run from the IDE

Make sure the IDE has annotation processing enabled for Maven projects. If that setting is off,
MapStruct mappers can disappear again after a restart or after cleaning the project.
