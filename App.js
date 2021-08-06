import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';

class Cat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sayi: '',
      sayi2: '',
      weight: '',
      height: '',
      sonuc: 'Point not entered!',
      sonuc2: 0,
      yorum: '',
      bg: 'grey',
      gelenVeriler: [],
    };
  }

  componentWillMount() {
    this.numberGet();
  }

  componentDidMount() {}

  async numberGet() {
    let data = await fetch('http://192.168.0.12:1999/api/category', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(data => data.json());
    console.log('gelen veriler', data);

    this.setState({gelenVeriler: data.entities});
  }

  async numberDelete(mahmut) {
    Alert.alert('DELETE', 'Do you want to delete?', [
      {
        text: 'Cancel',
        onPress: () => console.warn('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'DELETE',
        onPress: async () => {
          let data = await fetch(
            'http://192.168.0.12:1999/api/category/' + mahmut,
            {
              method: 'DELETE',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            },
          ).then(data => data.json());
          console.log('silme durumu', data);

          if (data.success == true) {
            this.numberGet();
          } else {
            Alert.alert('ATTENTION!!!', 'Cannot Deleted!');
            this.numberGet();
          }
        },
      },
    ]);
  }

  callPerson(huseyin) {
    // alert(sadasd);
    Linking.openURL(`tel:${huseyin}`);
  }

  ortalamaAl() {
    let sayi1 = parseFloat(this.state.sayi);
    let sayi2 = parseFloat(this.state.sayi2);

    if (!sayi1 || !sayi2) {
      this.setState({sonuc: 'Enter your info.', bg: 'gray'});
    } else {
      let hesapla = (sayi1 * 40) / 100 + (sayi2 * 60) / 100;

      console.log('ner lan', hesapla);

      this.setState({sonuc: hesapla});
    }
  }
  bodyMassIndex() {
    let weight = parseFloat(this.state.weight);
    let height = parseFloat(this.state.height);

    let calculate = weight / (height * height);

    if (!weight || !height) {
      this.setState({sonuc2: 0, yorum: 'Enter your info.', bg: 'gray'});
    } else if (calculate >= 30) {
      this.setState({yorum: 'Obesity', bg: 'red'});
    } else if (calculate < 30 && calculate >= 25) {
      this.setState({yorum: 'Overweight', bg: 'yellow'});
    } else if (calculate < 25 && calculate >= 18) {
      this.setState({yorum: 'Normal weight', bg: 'green'});
    } else if (calculate < 18) {
      this.setState({yorum: 'Underweight', bg: 'red'});
    }

    if (weight && height) {
      console.log('BodyMass', calculate);

      this.setState({sonuc2: calculate});
    }
  }

  async addNumber() {
    console.log('number1', this.state.number1);
    console.log('namesurname', this.state.nameSurname);

    let data = await fetch('http://192.168.0.12:1999/api/category', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Title: this.state.nameSurname,
        Description: this.state.number1,
        Hit: 10,
        Password: 'NewPassword',
        RePassword: 'NewPassword',
      }),
    }).then(data => data.json());
    console.log('data', data);

    if (data.id) {
      if (data.id > 0) {
        Alert.alert('COMPLETED', 'Added!');
        this.numberGet();
      }
    }
    if (!data.isSuccessFul) {
      alert(data.errors[0]);
    }
  }

  render() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    return (
      <ScrollView
        style={{backgroundColor: '#f5f5f5', flex: 1, height: windowHeight}}>
        <View style={{height: windowHeight}}>
          <View style={{backgroundColor: 'red', flexDirection: 'row'}}>
            <View style={{backgroundColor: 'gray', flex: 0.5, padding: 5}}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>
                Average
              </Text>
              <View
                style={{
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#333',
                  borderRadius: 6,
                  marginTop: 10,
                }}>
                <TextInput
                  value={this.state.sayi}
                  keyboardType="numeric"
                  onChangeText={val => this.setState({sayi: val})}
                  placeholder="Enter 1. exam result..."
                  style={{margin: 0, padding: 3}}
                />
              </View>
              <View
                style={{
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#333',
                  borderRadius: 6,
                  marginTop: 10,
                }}>
                <TextInput
                  value={this.state.sayi2}
                  keyboardType="numeric"
                  onChangeText={val => this.setState({sayi2: val})}
                  placeholder="Enter 2. exam result..."
                  style={{margin: 0, padding: 3}}
                />
              </View>

              <View style={{marginTop: 10}}>
                <Button onPress={() => this.ortalamaAl()} title="Calculate" />
              </View>
            </View>

            <View
              style={{
                backgroundColor: 'grey',
                flex: 0.5,
                padding: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'red', fontWeight: 'bold', fontSize: 25}}>
                {this.state.sonuc}
              </Text>
            </View>
          </View>

          <View style={{backgroundColor: 'red', flexDirection: 'row'}}>
            <View style={{backgroundColor: 'gray', flex: 0.5, padding: 5}}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>
                Body Mass Index
              </Text>
              <View
                style={{
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#333',
                  borderRadius: 6,
                  marginTop: 10,
                }}>
                <TextInput
                  value={this.state.weight}
                  keyboardType="numeric"
                  onChangeText={val => this.setState({weight: val})}
                  placeholder="Enter your weight, please..."
                  style={{margin: 0, padding: 3}}
                />
              </View>
              <View
                style={{
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#333',
                  borderRadius: 6,
                  marginTop: 10,
                }}>
                <TextInput
                  value={this.state.height}
                  keyboardType="numeric"
                  onChangeText={val => this.setState({height: val})}
                  placeholder="Enter your height, please..."
                  style={{margin: 0, padding: 3}}
                />
              </View>

              <View style={{marginTop: 10}}>
                <Button
                  onPress={() => this.bodyMassIndex()}
                  title="Calculate"
                />
              </View>
            </View>

            <View
              style={{
                backgroundColor: this.state.bg,
                flex: 0.5,
                padding: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 25}}>
                {parseFloat(this.state.sonuc2).toFixed(2)}
              </Text>

              {this.state.yorum ? (
                <View
                  style={{
                    borderWidth: 0,
                    padding: 3,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,.7)',
                  }}>
                  <Text style={{fontWeight: 'bold'}}>{this.state.yorum}</Text>
                </View>
              ) : null}
            </View>
          </View>
          <View style={{backgroundColor: 'gray', opacity: 0.8}}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Cochin',
                fontWeight: 'bold',
                fontSize: 30,
                marginLeft: 10,
              }}>
              Directory
            </Text>
          </View>
          <View style={{flex: 1, height: '100%'}}>
            <ImageBackground
              style={{
                width: '100%',
                height: '100%',
              }}
              source={require('../AybikeProject1/images/wallpaper.jpeg')}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 0.8, padding: 5}}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      opacity: 0.8,
                      borderWidth: 1,
                      borderColor: '#333',
                      borderRadius: 6,
                    }}>
                    <TextInput
                      value={this.state.number1}
                      keyboardType="numeric"
                      onChangeText={val => this.setState({number1: val})}
                      placeholder="Enter number..."
                      style={{margin: 0, padding: 3}}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: 'white',
                      opacity: 0.8,
                      borderWidth: 1,
                      borderColor: '#333',
                      borderRadius: 6,
                    }}>
                    <TextInput
                      value={this.state.nameSurname}
                      onChangeText={val => this.setState({nameSurname: val})}
                      placeholder="Name Surname..."
                      style={{margin: 0, padding: 3}}
                    />
                  </View>
                </View>

                <View
                  style={{
                    paddingRight: 5,
                    flex: 0.2,
                    justifyContent: 'center',
                    alignItems: 'flex-end',

                    padding: 5,
                  }}>
                  <Button onPress={() => this.addNumber()} title="Add" />
                </View>
              </View>

              <View>
                {this.state.gelenVeriler.map((veri, index) => {
                  return (
                    <View>
                      <TouchableOpacity
                        onLongPress={() => this.numberDelete(veri.id)}
                        onPress={() =>
                          this.callPerson(veri.description, 'ali', 'talha')
                        }>
                        <View
                          style={{
                            backgroundColor: 'rgba(255,255,255,.4)',
                            flexDirection: 'row',
                          }}>
                          <View style={{flex: 0.5}}>
                            <Text
                              style={{
                                fontSize: 20,
                                color: 'white',
                              }}>
                              {' '}
                              {veri.title}
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 0.5,
                              alignItems: 'flex-end',
                              marginRight: 10,
                            }}>
                            <Text
                              style={{
                                fontSize: 20,
                                color: 'white',
                              }}>
                              {' '}
                              {veri.description}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
                <View></View>
              </View>
            </ImageBackground>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default Cat;
