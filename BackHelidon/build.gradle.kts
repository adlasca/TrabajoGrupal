plugins {
    id("java")
    id("io.freefair.lombok")version "9.5.0"
    id("application")
}

group = "org.web"
version = "unspecified"

repositories {
    mavenCentral()
}

application {
    mainClass.set("org.web.Main")
}

dependencies {

    implementation("io.helidon.webserver:helidon-webserver:4.5.0")
    implementation("io.helidon.http.media:helidon-http-media-jsonb:4.5.0")
    implementation("io.helidon.dbclient:helidon-dbclient:4.5.0")
    implementation("io.helidon.dbclient:helidon-dbclient-jdbc:4.5.0")
    implementation("io.helidon.dbclient:helidon-dbclient-hikari:4.5.0")
    implementation("io.helidon.config:helidon-config-yaml:4.5.0")

    implementation("org.projectlombok:lombok:1.18.46")

    implementation("org.postgresql:postgresql:42.7.3")

    testImplementation(platform("org.junit:junit-bom:6.0.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.test {
    useJUnitPlatform()
}

sourceSets{
    main{
        output.setResourcesDir(
            file("${buildDir}/classes/java/main")
        )
    }
}