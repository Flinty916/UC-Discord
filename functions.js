module.exports = {
    nameFormat: function (profile) {
        if(profile.rank) {
            return `${profile.rank.abbreviation} ${profile.alias}`
        } else {
            return profile.alias
        }
    },
    rankOrAvatar: function(profile) {
        if(profile.rank && profile.rank.image.path) {
            return profile.rank.image.path
        } else if(profile.avatar) {
            return profile.avatar.path
        } else {
            return 'https://avatar.oxro.io/avatar.png?name=' + profile.alias.replace(' ', '%20') + '&length=2'
        }
    },
    arrayToList: function (items) {
        let list = ""
        if(items.length > 0) {
            for(let i = 0; i < items.length; ++i) {
                list += items[i].name
                if(i !== items.length-1)
                    list += ", "
            }
        } else {
            list = "N/A"
        }
        return list;
    },

}