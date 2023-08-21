<template>
    <div class="container">
        <div class="row">
            <div class="col-md-4"></div>
            <div class="col-md-4">
                <div class="card">
                    <div class="form-group">
                        <div class="text-center">
                            <span style="font-size: xx-large">Giriş Yap</span>
                        </div>
                        <div class="m-5">
                            <input class="form-control mb-2" v-model="username" type="text" placeholder="Kullanıcı Adı">
                            <input class="form-control mb-2" v-model="password" type="password" placeholder="Şifre">
                            <button class="btn btn-primary" @click="login">Giriş Yap</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4"></div>
        </div>
        <div class="row mt-5">
            <div class="col-md-4"></div>
            <div class="col-md-4">
                <div class="card">
                    <div class="form-group">
                        <div class="text-center">
                            <span style="font-size: x-large">Yapılan Geliştirmeler</span>
                            <br>
                            <span style="font-size: smaller; font-weight: bold;">Canlı Tarihi: 21/08/2023</span>
                        </div>
                        <div class="m-5">
                            <ul>
                                <li>Yeni talep butonu Talep aç şeklinde değiştirildi</li>
                                <li>Uzun talep girişlerinde kutu uzamaması hatası düzeltildi</li>
                                <li>Bildiri sistemi geliştirildi</li>
                                <li>Bildiri eposta hatası düzeltildi</li>
                                <li>Bildiri eposta şablonu eklendi</li>
                                <li>Değişikliklere dair tutulan geçmiş sistemi geliştirildi</li>
                                <li>Talep değişikliği yetkileri düzenlendi</li>
                                <li>Talep tarafında yorum yapıldıktan sonra oluşan eksiklik giderildi</li>
                                <li>Talep ekranında filtrelere arama seçeneği eklendi</li>
                                <li>Yeni talep oluştur ekranında girişlere arama seçeneği eklendi</li>
                                <li>Talep ekranında durum filtresinin başlangıç değeri "bekleyen" olarak düzenlendi</li>
                                <li>Çeşitli performans iyileştirmeleri yapıldı</li>
                                <li>Talepler ekranında tasarımsal iyileştirmeler yapıldı</li>
                                <li>Talpeler ekranında tablo görünüm ayarları yapıldı</li>
                                <li>Talep oluştur ekranında arama filtresi görünmeme sorunu giderildi</li>
                            </ul>
                        </div>

                        <div class="text-center">
                            <span style="font-size: x-large">Gelecek Geliştirmeler</span>
                        </div>
                        <div class="m-5">
                            <ul>
                                <li>Masaüstü bildirimleri</li>
                                <li>Talepler ekranında kolona göre sıralama filtresi</li>
                                <li>Talepler detay ekranında talepi oluşturan kişinin görünmesi</li>
                                <li>Uzun süre işleme alınmamış talepler için otomatik bildirim gönderme sistemi</li>
                                <li>Talepler ekranında Tarih aralığı filtresi</li>
                                <li>Talepler ekranında excel çıktısı alabilmek</li>
                                <li>Talepler detayını excel çıktısı alabilmek</li>
                                <li>Otomatik sistem yedekleme sistemi</li>
                                <li>Otomatik sistem yedekleme sonucu için bildirim</li>
                                <li>Online kullanıcıların gösterilmesi</li>
                                <li>Servis tarafı optimizasyon</li>
                                <li>Servis tarafı cache sistemi kullanılması</li>
                                <li>Servis tarafı sayfalama sistemi oluşturulması</li>
                                <li>Çeşitli raporların sunulacağı bir ekran</li>
                                <li>Raporların eposta ile gönderilmesi</li>
                                <li>Raporların excel çıktısı alınması</li>
                                <li>Tasarımsal iyileştirmeler</li>
                            </ul>
                            <label style="font-weight: bolder; font-size: large;" class="mt-5 mb-1">DİKKAT!</label>
                            <div class="container">
                                <label style="font-weight: bold;">İstediğiniz/İstemediğiniz herhangi bir geliştirmede lütfen
                                    iletişime
                                    geçiniz.</label>
                                <a style="font-weight: bold; color:blue; font-style: italic;"
                                    href="mailto:ihsan.celik@interlink.com.tr">ihsan.celik@interlink.com.tr</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4"></div>
        </div>
    </div>
</template>
<script>
export default {
    name: "LoginView",
    data() {
        return {
            username: "",
            password: ""
        }
    },
    methods: {
        login() {
            const device_id = localStorage.getItem("device_id");
            this.$store.dispatch("login", {
                username: this.username,
                password: this.password,
                device_id: device_id
            })
                .then(response => {
                    if (response)
                        this.$router.push({ name: 'tasks' })
                })
        }
    }
}
</script>